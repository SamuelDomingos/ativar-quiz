import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, useCallback } from "react";
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

  /**
   * 🔐 Gera ID único por navegador (persistente)
   */
  const getOrCreatePlayerId = useCallback(() => {
    if (typeof window === "undefined") return null;

    let playerId = localStorage.getItem("playerId");

    if (!playerId) {
      playerId = crypto.randomUUID();
      localStorage.setItem("playerId", playerId);
    }

    return playerId;
  }, []);

  /**
   * 📡 Buscar dados do quiz
   */
  useEffect(() => {
    if (!id) return;

    const socket = getSocket();

    socket.emit("monitoring:get-quiz-data", { quizId: id });

    socket.on("monitoring:quiz-data", (monitoringData: any) => {
      if (monitoringData.success && monitoringData.data) {
        const status = monitoringData.data.quizStatus;

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

  /**
   * 🚀 Entrar no quiz automaticamente
   */
  useEffect(() => {
    if (
      !isLoading &&
      !isLoadingIP &&
      shouldJoinRef.current &&
      !hasJoinedRef.current
    ) {
      const playerId = getOrCreatePlayerId();
      if (!playerId) return;

      hasJoinedRef.current = true;

      const socket = getSocket();

      socket.emit("player:join", {
        quizId: id,
        playerId,        // 🔥 identificador único real
        displayName: ip, // opcional (apenas visual)
      });
    }
  }, [isLoading, isLoadingIP, id, ip, getOrCreatePlayerId]);

  /**
   * 🎧 Eventos do player
   */
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
  }, []);

  return {
    data,
    isLoading: isLoading || isLoadingIP,
    error,
    isAvailable: !!data && !error,
  };
};