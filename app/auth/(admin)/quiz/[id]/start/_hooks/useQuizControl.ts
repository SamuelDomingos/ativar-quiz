import { useState, useEffect } from "react";

interface UseQuizControlReturn {
  currentQuestionIndex: number;
  timeLeft: number;
  isTimerRunning: boolean;
  handleNextQuestion: () => void;
  handlePreviousQuestion: () => void;
  startTimer: () => void;
  stopTimer: () => void;
  resetTimer: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function useQuizControl(
  totalQuestions: number,
  onQuestionChange?: (index: number) => void
): UseQuizControlReturn {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Timer para contar regressivo
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          return 30; // Reinicia quando chega a 0
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);


  useEffect(() => {
    setTimeLeft(30);
    setIsTimerRunning(false);
    onQuestionChange?.(currentQuestionIndex);
  }, [currentQuestionIndex, onQuestionChange]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsTimerRunning(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setIsTimerRunning(true);
    }
  };

  const startTimer = () => {
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setTimeLeft(30);
    setIsTimerRunning(false);
  };

  const canGoNext = currentQuestionIndex < totalQuestions - 1;
  const canGoPrevious = currentQuestionIndex > 0;

  return {
    currentQuestionIndex,
    timeLeft,
    isTimerRunning,
    handleNextQuestion,
    handlePreviousQuestion,
    startTimer,
    stopTimer,
    resetTimer,
    canGoNext,
    canGoPrevious,
  };
}