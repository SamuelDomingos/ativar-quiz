import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { Question, QuestionOption } from "@/lib/generated/prisma/client";

interface MonitoringData {
  data: {
    totalParticipants: number;
    quizStatus: string;
    questionStartedAt?: Date;
    currentQuestion?: Question & {
      options: QuestionOption[];
    };
    answersCount: number;
    optionCounts?: { optionId: string; count: number }[];
    userAnswerOptionId?: string | null;
  };
}

export function useQuizMonitoring(quizId: string) {
  const [monitoringData, setMonitoringData] = useState<MonitoringData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!quizId) return;

    const socket = getSocket();

    socket.emit("quiz:join", quizId);
    socket.emit("monitoring:get-quiz-data", { quizId });

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

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        !monitoringData?.data?.currentQuestion?.duration ||
        !monitoringData?.data?.questionStartedAt
      ) {
        setTimeRemaining(0);
        return;
      }

      const startedAt = new Date(
        monitoringData.data.questionStartedAt,
      ).getTime();
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = monitoringData.data.currentQuestion.duration - elapsed;

      setTimeRemaining(Math.max(0, remaining));
    }, 100);

    return () => clearInterval(interval);
  }, [
    monitoringData?.data?.currentQuestion?.duration,
    monitoringData?.data?.questionStartedAt,
  ]);

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
    timeRemaining,
  };
}
