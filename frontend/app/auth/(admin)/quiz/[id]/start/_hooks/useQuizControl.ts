import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
interface UseQuizControlReturn {
  handleNextQuestion: () => void;
  handleBackQuestion: () => void;
  isLoading: boolean;
}

export function useQuizControl(quizId: string): UseQuizControlReturn {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleBackQuestion = () => {
    setIsLoading(true);
    const socket = getSocket();
    socket.emit("question:back", { quizId });
  };

  const handleNextQuestion = () => {
    setIsLoading(true);
    const socket = getSocket();
    socket.emit("question:next", { quizId });
  };

  useEffect(() => {
    const socket = getSocket();

    const invalidateQuiz = () => {
      queryClient.invalidateQueries({ queryKey: ["quiz", quizId] });
    };

    socket.on("question:next", () => {
      setIsLoading(false);
      invalidateQuiz();
    });

    socket.on("question:back", () => {
      setIsLoading(false);
      invalidateQuiz();
    });

    socket.on("quiz:finished", () => {
      setIsLoading(false);
      invalidateQuiz();
    });

    socket.on("question:error", () => {
      setIsLoading(false);
    });

    return () => {
      socket.off("question:next");
      socket.off("question:back");
      socket.off("quiz:finished");
      socket.off("question:error");
    };
  }, [quizId, queryClient]);

  return {
    handleBackQuestion,
    handleNextQuestion,
    isLoading,
  };
}