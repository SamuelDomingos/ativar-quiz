import { useState, useEffect } from "react";
import { getSocket } from "@/lib/socket";

export function useUserControl({
  currentQuestionId,
}: {
  currentQuestionId: string;
}) {
  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCurrentAnswer, setIsLoadingCurrentAnswer] = useState(false);

  const selectAnswer = (optionId: string) => {
    // Só bloqueia se está enviando no momento
    if (isSubmitting || !currentQuestionId) return;

    setSelectedAnswerId(optionId);
    setIsSubmitting(true);

    const socket = getSocket();
    socket.emit("answer:submit", {
      questionId: currentQuestionId,
      optionId,
    });
  };

  const fetchCurrentAnswer = (questionId: string) => {
    if (!questionId) return;

    setIsLoadingCurrentAnswer(true);

    const socket = getSocket();

    socket.emit("answer:get-current", {
      questionId,
    });

    const handleAnswerCurrent = ({
      questionId: qId,
      optionId,
    }: {
      questionId: string;
      optionId: string | null;
      answeredAt: string | null;
    }) => {
      if (qId === questionId) {
        setSelectedAnswerId(optionId);
        setIsLoadingCurrentAnswer(false);

        socket.off("answer:current", handleAnswerCurrent);
      }
    };

    socket.on("answer:current", handleAnswerCurrent);

    const timeout = setTimeout(() => {
      socket.off("answer:current", handleAnswerCurrent);
      setIsLoadingCurrentAnswer(false);
    }, 5000);

    return () => clearTimeout(timeout);
  };

  useEffect(() => {
    const socket = getSocket();

    const handleAnswerConfirmed = () => {
      setIsSubmitting(false);
    };

    const handleAnswerError = () => {
      setIsSubmitting(false);
    };

    socket.on("answer:confirmed", handleAnswerConfirmed);
    socket.on("answer:error", handleAnswerError);

    return () => {
      socket.off("answer:confirmed", handleAnswerConfirmed);
      socket.off("answer:error", handleAnswerError);
    };
  }, []);

  useEffect(() => {
    if (!currentQuestionId) {
      setSelectedAnswerId(null);
      setIsSubmitting(false);
      return;
    }

    // Puxar resposta atual quando questão muda
    fetchCurrentAnswer(currentQuestionId);
  }, [currentQuestionId]);

  return {
    selectedAnswerId,
    isSubmitting,
    isLoadingCurrentAnswer,
    selectAnswer,
    fetchCurrentAnswer,
  };
}
