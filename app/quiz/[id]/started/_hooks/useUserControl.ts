import { useMemo } from "react";
import { markAnswer } from "@/lib/api/userControl";
import { useFetch } from "@/hooks/useFetch";

export function useUserControl(
  sessionId: string,
  questionId: string,
  optionId: string,
) {
  const fetchOptions = useMemo(
    () => ({
      auto: false,
      defaultArgs:
        sessionId && questionId && optionId
          ? [sessionId, questionId, optionId]
          : [],
    }),
    [sessionId, questionId, optionId],
  );

  const { execute, data, isLoading, error } = useFetch(
    markAnswer,
    fetchOptions,
  );

  return {
    execute,
    data,
    isLoading,
    error,
  };
}
