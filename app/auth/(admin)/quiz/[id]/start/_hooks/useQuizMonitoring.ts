import { getQuestionMonitoringData } from "@/lib/api/quiz";
import { useQuery } from "@tanstack/react-query";

export function useQuizMonitoring(quizId: string, questionId: string) {
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["quiz", "verify", quizId, questionId],
    queryFn: () => getQuestionMonitoringData(quizId, questionId),
    refetchInterval: 10000,
    refetchIntervalInBackground: true,
    enabled: !!quizId && !!questionId,
    staleTime: 0,
    gcTime: 1000 * 60 * 5,
    retry: 1,
  });

  return {
    monitoringData: data,
    isLoading,
    error,
    isFetching,
  };
}
