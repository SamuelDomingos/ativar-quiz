import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function useUserControl({
  currentQuestionId,
}: {
  currentQuestionId: string;
}) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectAnswer = (optionId: string) => {
    if (hasAnswered || isSubmitting || !currentQuestionId) return;

    setSelectedAnswerId(optionId);
    setIsSubmitting(true);

    const socket = getSocket();
    socket.emit("answer:submit", {
      questionId: currentQuestionId,
      optionId,
    });
  };

  useEffect(() => {
    const socket = getSocket();

    const handleAnswerConfirmed = () => {
      setHasAnswered(true);
      setIsSubmitting(false);
    };

    const handleAnswerError = () => {
      setIsSubmitting(false);
      setSelectedAnswerId(null)
    };

    socket.on("answer:confirmed", handleAnswerConfirmed);
    socket.on("answer:error", handleAnswerError);

    return () => {
      socket.off("answer:confirmed", handleAnswerConfirmed);
      socket.off("answer:error", handleAnswerError);
    };
  }, []);

  useEffect(() => {
  setSelectedAnswerId(null);
  setHasAnswered(false);
  setIsSubmitting(false);
}, [currentQuestionId]);

  return {
    selectedAnswerId,
    hasAnswered,
    isSubmitting,
    selectAnswer,
  };
}