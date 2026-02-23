import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { useUserIP } from "@/hooks/useUserIP";

interface QuizData {
  totalParticipants: number;
  quizStatus: string;
  currentQuestion?: {
    id: string;
    title: string;
    order: number;
    duration: number;
  };
  answersCount?: number;
  totalOptions?: number;
}

export const useVerifyQuiz = (id: string) => {
  const router = useRouter();
  const { ip, isLoading: isLoadingIP } = useUserIP();

  const [data, setData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const hasJoinedRef = useRef(false);
  const shouldJoinRef = useRef(false);
  const quizStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const socket = getSocket();
    socket.emit("monitoring:get-quiz-data", { quizId: id });

    socket.on("monitoring:quiz-data", (monitoringData: any) => {
      if (monitoringData.success && monitoringData.data) {
        const status = monitoringData.data.quizStatus;
        quizStatusRef.current = status;
        setData(monitoringData.data);
        setIsLoading(false);

        shouldJoinRef.current =
          (status === "WAITING" || status === "STARTED") &&
          !hasJoinedRef.current;

        if (status === "PAUSED" || status === "FINISHED") {
          router.push("/");
        }
      } else {
        setError(monitoringData.error || "Erro ao carregar quiz");
        setIsLoading(false);
      }
    });

    socket.on("monitoring:error", (err: any) => {
      setError(err.message);
      setIsLoading(false);
    });

    return () => {
      socket.off("monitoring:quiz-data");
      socket.off("monitoring:error");
    };
  }, [id, router]);

  useEffect(() => {
    if (
      !isLoading &&
      !isLoadingIP &&
      ip &&
      shouldJoinRef.current &&
      !hasJoinedRef.current
    ) {
      hasJoinedRef.current = true;
      const socket = getSocket();
      socket.emit("player:join", { quizId: id, userName: ip });
    }
  }, [isLoading, isLoadingIP, ip, id]);

  useEffect(() => {
    const socket = getSocket();

    socket.on("player:joined", (joinData: { sessionId: string }) => {
      if (joinData?.sessionId) {
        sessionStorage.setItem("sessionId", joinData.sessionId);
      }
    });

    socket.on("player:error", (err: any) => {
      setError(err.message);
      hasJoinedRef.current = false;
      shouldJoinRef.current = false;
    });

    return () => {
      socket.off("player:joined");
      socket.off("player:error");
    };
  }, [id, router]);

  return {
    data,
    isLoading: isLoading || isLoadingIP,
    error,
    isAvailable: !!data && !error,
  };
};
