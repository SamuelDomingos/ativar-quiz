import { useFetch } from "@/hooks/useFetch";
import { getAllQuizzes, createQuiz, getQuizById } from "@/lib/api/quiz";
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

export const useGetId = (id: string) => {
  const fetchOptions = useMemo(
    () => ({
      auto: true,
      defaultArgs: [id],
    }),
    [id],
  );

  const {
    execute: getDataId,
    data,
    isLoading,
    error,
  } = useFetch(getQuizById, fetchOptions);

  return {
    getDataId,
    data,
    isLoading,
    error,
  };
};
