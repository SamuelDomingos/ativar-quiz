import { useFetch } from "@/hooks/useFetch";
import { getAllQuizzes, createQuiz } from "@/lib/api/quiz";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";

export const useCreateQuiz = () => {
  const {
    execute: uploadData,
    data,
    isLoading,
    error,
  } = useFetch(createQuiz, {
    successMessage: "Quiz criado com sucesso!",
    errorMessage: "Erro ao criar o quiz!",
  });

  return {
    uploadData,
    data,
    isLoading,
    error,
  };
};

export const useGetAllQuizzes = () => {
  const fetchOptions = useMemo(
    () => ({
      auto: true,
      defaultArgs: [],
    }),
    [],
  );

  const {
    execute: getData,
    data,
    isLoading,
    error,
  } = useFetch(getAllQuizzes, fetchOptions);

  return {
    getData,
    data,
    isLoading,
    error,
  };
};

export const useGetQuizStatus = (quizId: string) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!quizId) return;

    const socket = getSocket();

    socket.emit("quiz:join", quizId);

    socket.emit("monitoring:get-quiz-data", { quizId });

    socket.on("monitoring:quiz-data", (monitoringData) => {
      setData(monitoringData?.data);
      setIsLoading(false);
      setIsFetching(false);
      setError(null);
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
    getStatus: refetch,
    data,
    isLoading,
    error,
    isFetching,
  };
};
