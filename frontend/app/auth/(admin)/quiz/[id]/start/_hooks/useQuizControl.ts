import { useMutation } from "@tanstack/react-query";
import { quizControlQuestions } from "@/lib/api/control";
import { QuizWithQuestions } from "@/lib/api/quiz";

interface UseQuizControlReturn {
  handleStartQuiz: () => void;
  handleNextQuestion: () => void;
  canGoNext: boolean;
  isLoading: boolean;
}

export function useQuizControl(quiz?: QuizWithQuestions): UseQuizControlReturn {
  const startMutation = useMutation({
    mutationFn: () =>
      quizControlQuestions({
        idQuiz: quiz?.id || "",
        action: "start",
      }),
  });

  const nextMutation = useMutation({
    mutationFn: () =>
      quizControlQuestions({
        idQuiz: quiz?.id || "",
        action: "next",
      }),
  });

  const getCurrentIndex = () => {
    if (!quiz?.currentQuestionId || !quiz?.questions) return -1;
    return quiz.questions.findIndex((q) => q.id === quiz.currentQuestionId);
  };

  const currentIndex = getCurrentIndex();
  const canGoNext =
    currentIndex >= 0 && currentIndex < (quiz?.questions?.length || 0) - 1;

  return {
    handleStartQuiz: startMutation.mutate,
    handleNextQuestion: nextMutation.mutate,
    canGoNext,
    isLoading: startMutation.isPending || nextMutation.isPending,
  };
}
