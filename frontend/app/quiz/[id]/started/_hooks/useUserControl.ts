// hooks/useUserControl.ts
import { useState, useCallback, useEffect } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";

export function useUserControl({
  currentQuestionId,
}: {
  sessionId: string;
  currentQuestionId: string;
}) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAnswer = useCallback(async () => {
    if (!selectedAnswerId || !currentQuestionId || hasAnswered) return;

    setIsSubmitting(true);
    const socket = getSocket();

    socket.emit("answer:submit", {
      questionId: currentQuestionId,
      optionId: selectedAnswerId,
    });
  }, [selectedAnswerId, currentQuestionId, hasAnswered]);

  const resetAnswer = useCallback(() => {
    setSelectedAnswerId(null);
    setHasAnswered(false);
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const handleAnswerConfirmed = () => {
      setHasAnswered(true);
      setIsSubmitting(false);
      toast.success("Resposta registrada!");
    };

    const handleAnswerError = (error: any) => {
      setIsSubmitting(false);
      toast.error(error);
    };

    socket.on("answer:confirmed", handleAnswerConfirmed);
    socket.on("answer:error", handleAnswerError);

    return () => {
      socket.off("answer:confirmed", handleAnswerConfirmed);
      socket.off("answer:error", handleAnswerError);
    };
  }, []);

  return {
    selectedAnswerId,
    hasAnswered,
    setSelectedAnswerId,
    handleSubmitAnswer,
    resetAnswer,
    isSubmitting,
    isLoading: isSubmitting,
  };
}
