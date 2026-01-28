"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Users, CheckCircle2 } from "lucide-react";

interface Question {
  id: string;
  type: "true-false" | "multiple-choice";
  text: string;
  options?: string[];
}

interface UserAnswer {
  userId: string;
  questionId: string;
  answer: boolean | number;
}

const ResultsPage = () => {
  const [questions, setQuestions] = useState<Question[]>([
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
  ]);

  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalUsers] = useState(5);
  const [showAll, setShowAll] = useState(false);

  // Simula recebimento de respostas em tempo real
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

  // Auto-avança quando todas as respostas da pergunta atual chegarem
  useEffect(() => {
    if (!showAll && currentIndex < questions.length && userAnswers.length > 0) {
      const answersForCurrentQuestion = userAnswers.filter(
        (a) => a.questionId === questions[currentIndex].id
      );

      if (answersForCurrentQuestion.length === totalUsers && currentIndex < questions.length - 1) {
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [userAnswers, currentIndex, questions, totalUsers, showAll]);

  const getQuestionResults = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId);
    const answersForQuestion = userAnswers?.filter((a) => a?.questionId === questionId) || [];

    if (question?.type === "true-false") {
      const trueCount = answersForQuestion.filter((a) => a.answer === true).length;
      const falseCount = answersForQuestion.filter((a) => a.answer === false).length;

      return [
        {
          label: "Verdadeiro",
          count: trueCount,
          percentage:
            answersForQuestion.length > 0
              ? Math.round((trueCount / answersForQuestion.length) * 100)
              : 0,
        },
        {
          label: "Falso",
          count: falseCount,
          percentage:
            answersForQuestion.length > 0
              ? Math.round((falseCount / answersForQuestion.length) * 100)
              : 0,
        },
      ];
    } else {
      return (question?.options || []).map((option, index) => {
        const count = answersForQuestion.filter((a) => a.answer === index).length;
        return {
          label: option,
          count,
          percentage:
            answersForQuestion.length > 0
              ? Math.round((count / answersForQuestion.length) * 100)
              : 0,
        };
      });
    }
  };

  const renderQuestionCard = (question: Question) => {
    const results = getQuestionResults(question.id);
    const totalAnswered = userAnswers?.filter((a) => a?.questionId === question.id)?.length || 0;
    const maxCount = Math.max(...results.map((r) => r.count), 0);

    return (
      <Card key={question.id} className="p-6 animate-fade-in">
        {/* Título */}
        <h3 className="text-lg font-bold text-gray-900 mb-6">{question.text}</h3>

        {/* Resultados */}
        <div className="space-y-5">
          {results.map((result, idx) => {
            const isHighest = result.count === maxCount && result.count > 0;

            return (
              <div key={idx} className="flex items-center gap-3">
                {/* Label e círculo */}
                <div className="flex items-center gap-2 min-w-fit">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                      isHighest ? "bg-teal-600" : "bg-slate-400"
                    }`}
                  >
                    {result.count}
                  </div>
                  <span className="text-sm font-medium text-gray-700 min-w-max">
                    {result.label}
                  </span>
                </div>

                {/* Barra de progresso */}
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-8 bg-gray-300 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 flex items-center justify-end pr-3 ${
                        isHighest ? "bg-teal-600" : "bg-gray-500"
                      }`}
                      style={{ width: `${result.percentage}%` }}
                    >
                      {result.percentage > 10 && (
                        <span className="text-white text-xs font-bold">
                          {result.percentage}%
                        </span>
                      )}
                    </div>
                  </div>
                  {result.percentage <= 10 && (
                    <span className="text-xs font-bold text-gray-700 min-w-fit">
                      {result.percentage}%
                    </span>
                  )}
                </div>

                {/* Checkmark se é a maior */}
                {isHighest && (
                  <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>

        {/* Info de respostas */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <Users className="w-4 h-4" />
            <span>
              {totalAnswered} de {totalUsers} responderam
            </span>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resultados</h1>
          <p className="text-gray-600">
            {showAll
              ? "Todos os resultados"
              : `Pergunta ${currentIndex + 1} de ${questions.length}`}
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-6">
          {showAll
            ? questions.map((question) => renderQuestionCard(question))
            : renderQuestionCard(questions[currentIndex])}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        :global(.animate-fade-in) {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ResultsPage;