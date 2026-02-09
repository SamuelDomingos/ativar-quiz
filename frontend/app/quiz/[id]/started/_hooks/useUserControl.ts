import { useState, useCallback, useEffect } from "react";
import { markAnswer } from "@/lib/api/userControl";
import { useFetch } from "@/hooks/useFetch";

export function useUserControl({
  sessionId,
  currentQuestionId,
}: {
  sessionId: string;
  currentQuestionId: string;
}) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { execute: submitAnswer, isLoading: isLoadingSubmit } = useFetch(
    markAnswer,
    { auto: false },
  );

  const handleSubmitAnswer = useCallback(async () => {
    if (!selectedAnswerId || !currentQuestionId || hasAnswered) return;

    try {
      setIsSubmitting(true);

      await submitAnswer(sessionId, currentQuestionId, selectedAnswerId);

      setHasAnswered(true);
    } catch (error) {
      console.error("Erro ao enviar resposta:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [sessionId, currentQuestionId, selectedAnswerId, submitAnswer, hasAnswered]);

  const resetAnswer = useCallback(() => {
    setSelectedAnswerId(null);
    setHasAnswered(false);
  }, []);

  useEffect(() => {
    if (currentQuestionId) {
      resetAnswer();
    }
  }, [currentQuestionId, resetAnswer]);

  return {
    selectedAnswerId,
    hasAnswered,

    setSelectedAnswerId,

    handleSubmitAnswer,
    resetAnswer,

    isSubmitting,
    isLoading: isLoadingSubmit,
  };
}
