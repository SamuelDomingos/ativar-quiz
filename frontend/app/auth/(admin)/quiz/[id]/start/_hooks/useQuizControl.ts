
import { useEffect, useState } from "react";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";

interface UseQuizControlReturn {
  handleStartQuiz: () => void;
  handleNextQuestion: () => void;
  currentQuestion: any;
  isLoading: boolean;
}

export function useQuizControl(quizId: string): UseQuizControlReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleStartQuiz = () => {
    setIsLoading(true);
    const socket = getSocket();
    socket.emit("question:start", { quizId });
  };

  const handleNextQuestion = () => {
    setIsLoading(true);
    const socket = getSocket();
    socket.emit("question:next", { quizId });
  };

  useEffect(() => {
    const socket = getSocket();

    socket.on("question:started", (data) => {
      setIsLoading(false);
      setCurrentQuestion(data);
      toast.success("Questão iniciada!");
    });

    socket.on("question:ready", (data) => {
      setIsLoading(false);
      setCurrentQuestion(data);
      toast.success("Próxima questão!");
    });

    socket.on("quiz:finished", () => {
      setIsLoading(false);
      toast.success("Quiz finalizado!");
    });

    socket.on("question:error", (error) => {
      setIsLoading(false);
      toast.error(error.message);
    });

    socket.on("monitoring:quiz-data", (data) => {
      if (data.data?.currentQuestion) {
        setTotalQuestions(data.data.currentQuestion.order || totalQuestions);
      }
    });

    return () => {
      socket.off("question:started");
      socket.off("question:ready");
      socket.off("quiz:finished");
      socket.off("question:error");
      socket.off("monitoring:quiz-data");
    };
  }, []);

  return {
    currentQuestion,
    handleStartQuiz,
    handleNextQuestion,
    isLoading,
  };
}
