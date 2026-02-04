import { useFetch } from "@/hooks/useFetch";
import { getQuizById } from "@/lib/api/quiz";
import { useMemo } from "react";

export const useQuizId = (id: string) => {
  const fetchOptions = useMemo(
    () => ({
      auto: true,
      defaultArgs: [id],
    }),
    [id],
  );

  const {
    execute: getStatus,
    data,
    isLoading,
    error,
  } = useFetch(getQuizById, fetchOptions);

  return {
    getStatus,
    data,
    isLoading,
    error,
  };
};
