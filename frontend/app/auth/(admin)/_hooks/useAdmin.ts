import { useFetch } from "@/hooks/useFetch";
import {
  getAllQuizzes,
  createQuiz,
  getQuizById,
  getQuizStatus,
} from "@/lib/api/quiz";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

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

export const useGetQuizStatus = (id: string) => {
  const { data, isLoading, error, isFetching, refetch } = useQuery({
    queryKey: ["quiz", "status", id],
    queryFn: () => getQuizStatus(id),
    refetchInterval: (query) => {
      const status = query.state.data?.data?.status;
      return status === "STARTED" || status === "WAITING" ? 10000 : false;
    },
    refetchIntervalInBackground: true,
    enabled: !!id,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    getStatus: refetch,
    data,
    isLoading,
    error,
    isFetching,
  };
};
