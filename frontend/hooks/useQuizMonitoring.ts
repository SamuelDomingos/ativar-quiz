import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

interface MonitoringData {
  totalParticipants: number;
  answeredCount: number;
  participants: Array<{
    id: string;
    name: string;
    answered: boolean;
  }>;
  answerStatistics: Array<{
    optionId: string;
    optionLabel: string;
    isCorrect: boolean;
    count: number;
    percentage: number;
  }>;
}

export function useQuizMonitoring(quizId: string) {
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    const socket = getSocket();

    socket.emit("quiz:join", quizId);

    socket.on("monitoring:quiz-data", (data) => {
      if (data.success && data) {
        setMonitoringData(data);
        setIsLoading(false);
        setIsFetching(false);
        setError(null);
      }
    });

    socket.on("monitoring:error", (err) => {
      setError(err.message);
      setIsLoading(false);
      setIsFetching(false);
    });

    return () => {
      socket.off("monitoring:quiz-data");
      socket.off("monitoring:error");
    };
  }, [quizId]);

  const refetch = () => {
    if (!quizId) return;
    setIsFetching(true);
    const socket = getSocket();
    socket.emit("monitoring:get-quiz-data", { quizId });
  };

  return {
    monitoringData,
    isLoading,
    error,
    isFetching,
    refetch,
  };
}
