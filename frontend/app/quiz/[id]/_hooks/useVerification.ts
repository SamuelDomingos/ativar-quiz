// hooks/useVerifyQuiz.ts
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

interface JoinData {
  sessionId: string;
}

export const useVerifyQuiz = (id: string) => {
  const router = useRouter();
  const { ip, isLoading: isLoadingIP } = useUserIP();

  const [data, setData] = useState<QuizData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isJoining, setIsJoining] = useState(false);
  const [joinData, setJoinData] = useState<JoinData | null>(null);

  const hasJoinedRef = useRef(false);
  const shouldJoinRef = useRef(false);

  useEffect(() => {
    if (!id) return;

    const socket = getSocket();
    socket.emit("monitoring:get-quiz-data", { quizId: id });

    const handleMonitoringData = (monitoringData: any) => {
      if (monitoringData.success && monitoringData.data) {
        setData(monitoringData.data);
        setIsLoading(false);
        setError(null);


        const status = monitoringData.data.quizStatus;
        shouldJoinRef.current =
          (status === "WAITING" || status === "STARTED") &&
          !hasJoinedRef.current;
      } else {
        setError(monitoringData.error || "Erro ao carregar quiz");
        setIsLoading(false);
      }
    };

    const handleMonitoringError = (err: any) => {
      setError(err.message);
      setIsLoading(false);
    };

    socket.on("monitoring:quiz-data", handleMonitoringData);
    socket.on("monitoring:error", handleMonitoringError);

    return () => {
      socket.off("monitoring:quiz-data", handleMonitoringData);
      socket.off("monitoring:error", handleMonitoringError);
    };
  }, [id]);

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
      socket.emit("player:join", {
        quizId: id,
        userName: `Usuário-${ip.split(".").pop()}` || "Usuário",
      });
    }
  }, [isLoading, isLoadingIP, ip, id]);

  // Redirecionar baseado no status
  useEffect(() => {
    if (!isLoading && data) {
      const status = data.quizStatus;

      if (status === "PAUSED" || status === "FINISHED") {
        router.push("/");
        return;
      }

      if (status === "STARTED") {
        router.push(`/quiz/${id}/started`);
      }
    }
  }, [data, isLoading, router, id]);

  useEffect(() => {
    const socket = getSocket();

    const handlePlayerJoined = (joinedData: JoinData) => {
      setJoinData(joinedData);
      setIsJoining(false);
    };

    const handlePlayerError = (err: any) => {
      setError(err.message);
      setIsJoining(false);
      hasJoinedRef.current = false;
      shouldJoinRef.current = false;
    };

    socket.on("player:joined", handlePlayerJoined);
    socket.on("player:error", handlePlayerError);

    return () => {
      socket.off("player:joined", handlePlayerJoined);
      socket.off("player:error", handlePlayerError);
    };
  }, []);

  return {
    data,
    isLoading: isLoading || isLoadingIP || isJoining,
    error,
    isAvailable: !!data && !error,
    joinData,
    userIP: ip,
  };
};