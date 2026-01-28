"use client";

import { useLiveResults } from "./_hooks/useLiveResults";
import { QuestionResultCard } from "./_components/QuestionResultCard";

interface Question {
  id: string;
  type: "true-false" | "multiple-choice";
  text: string;
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "1",
    type: "true-false",
    text: "A capital do Brasil é Brasília?",
  },
  {
    id: "2",
    type: "multiple-choice",
    text: "Qual é o maior planeta do sistema solar?",
    options: ["Saturno", "Júpiter", "Netuno", "Terra"],
  },
  {
    id: "3",
    type: "true-false",
    text: "A água ferve a 100°C ao nível do mar?",
  },
  {
    id: "4",
    type: "multiple-choice",
    text: "Qual país tem a maior população?",
    options: ["Índia", "China", "EUA", "Indonésia"],
  },
];

const TOTAL_USERS = 5;

const ResultsPage = () => {
  const { userAnswers, currentIndex, showAll } = useLiveResults(
    QUESTIONS,
    TOTAL_USERS,
  );

  const getResultsForQuestion = (question: Question) => {
    const answers = userAnswers.filter(
      (a) => a && a.questionId === question.id,
    );

    if (question.type === "true-false") {
      const trueCount = answers.filter((a) => a.answer === true).length;
      const falseCount = answers.filter((a) => a.answer === false).length;

      return [
        {
          label: "Verdadeiro",
          count: trueCount,
          percentage: answers.length
            ? Math.round((trueCount / answers.length) * 100)
            : 0,
        },
        {
          label: "Falso",
          count: falseCount,
          percentage: answers.length
            ? Math.round((falseCount / answers.length) * 100)
            : 0,
        },
      ];
    }

    return (question.options || []).map((option, index) => {
      const count = answers.filter((a) => a.answer === index).length;

      return {
        label: option,
        count,
        percentage: answers.length
          ? Math.round((count / answers.length) * 100)
          : 0,
      };
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10 px-4">
      <div className="w-full max-w-2xl space-y-6">
        {(showAll ? QUESTIONS : [QUESTIONS[currentIndex]]).map((question) => {
          const results = getResultsForQuestion(question);
          const totalAnswered = userAnswers.filter(
            (a) => a && a.questionId === question.id,
          ).length;

          return (
            <QuestionResultCard
              key={question.id}
              question={question}
              results={results}
              totalAnswered={totalAnswered}
              totalUsers={TOTAL_USERS}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ResultsPage;
