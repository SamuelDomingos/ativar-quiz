import { useEffect, useState } from "react";

interface UserAnswer {
  userId: string;
  questionId: string;
  answer: boolean | number;
}

export function useLiveResults(questions, totalUsers) {
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const mockAnswers: UserAnswer[] = [
      { userId: "user1", questionId: "1", answer: true },
      { userId: "user2", questionId: "1", answer: true },
      { userId: "user3", questionId: "1", answer: true },
      { userId: "user4", questionId: "1", answer: false },
      { userId: "user5", questionId: "1", answer: true },
      { userId: "user1", questionId: "2", answer: 1 },
      { userId: "user2", questionId: "2", answer: 1 },
      { userId: "user3", questionId: "2", answer: 2 },
      { userId: "user4", questionId: "2", answer: 1 },
      { userId: "user5", questionId: "2", answer: 0 },
      { userId: "user1", questionId: "3", answer: true },
      { userId: "user2", questionId: "3", answer: false },
      { userId: "user3", questionId: "3", answer: true },
      { userId: "user4", questionId: "3", answer: true },
      { userId: "user5", questionId: "3", answer: true },
      { userId: "user1", questionId: "4", answer: 0 },
      { userId: "user2", questionId: "4", answer: 1 },
      { userId: "user3", questionId: "4", answer: 0 },
      { userId: "user4", questionId: "4", answer: 1 },
      { userId: "user5", questionId: "4", answer: 0 },
    ];
    let index = 0;

    const interval = setInterval(() => {
      if (index < mockAnswers.length) {
        setUserAnswers((prev) => [...prev, mockAnswers[index]]);
        index++;
      } else {
        clearInterval(interval);
        setShowAll(true);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showAll) return;

    const answersForCurrent = userAnswers.filter(
      (a) => a && a.questionId === questions[currentIndex]?.id,
    );

    if (
      answersForCurrent.length === totalUsers &&
      currentIndex < questions.length - 1
    ) {
      const timer = setTimeout(() => {
        setCurrentIndex((i) => i + 1);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [userAnswers, currentIndex, showAll, questions, totalUsers]);

  return {
    userAnswers,
    currentIndex,
    showAll,
  };
}
