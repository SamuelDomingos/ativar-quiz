"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Clock, Timer } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Question {
  id: string;
  type: "true-false" | "multiple-choice";
  text: string;
  options?: string[];
  timeLimit?: number; // em segundos
}

const StartedPage = () => {
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: "1",
      type: "true-false",
      text: "A capital do Brasil é Brasília?",
      timeLimit: 20,
    },
    {
      id: "2",
      type: "multiple-choice",
      text: "Qual é o maior planeta do sistema solar?",
      options: ["Saturno", "Júpiter", "Netuno", "Terra"],
      timeLimit: 25,
    },
    {
      id: "3",
      type: "true-false",
      text: "A água ferve a 100°C ao nível do mar?",
      timeLimit: 20,
    },
    {
      id: "4",
      type: "multiple-choice",
      text: "Qual país tem a maior população?",
      options: ["Índia", "China", "EUA", "Indonésia"],
      timeLimit: 30,
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [answered, setAnswered] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const [questionStarted, setQuestionStarted] = useState(false);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const timeLimit = currentQuestion?.timeLimit || 30;
  const timePercentage = (timeLeft / timeLimit) * 100;

  // Inicia countdown quando admin libera para responder
  useEffect(() => {
    if (!questionStarted) return;

    if (timeLeft <= 0 && questionStarted && !answered) {
      setTimeExpired(true);
      setAnswered(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, questionStarted, answered]);

  // Simula admin liberando para começar a responder
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuestionStarted(true);
      setTimeLeft(timeLimit);
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentIndex, timeLimit]);

  const handleAnswer = (answer: boolean | number) => {
    if (!questionStarted || answered || timeExpired) return;

    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
    setAnswered(true);
  };

  // Auto-avança quando admin libera continuar
  useEffect(() => {
    if (canContinue) {
      const timer = setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setUserAnswers((prev) => ({ ...prev }));
          setAnswered(false);
          setShowAnswer(false);
          setCanContinue(false);
          setTimeExpired(false);
          setQuestionStarted(false);
          setTimeLeft(0);
        } else {
          // Quiz finalizado
          console.log("Quiz concluído!");
        }
      }, 2000); // Aguarda 2s antes de avançar

      return () => clearTimeout(timer);
    }
  }, [canContinue, currentIndex, questions.length]);

  // Simula admin liberando resposta após 3 segundos
  useEffect(() => {
    if (answered && !showAnswer) {
      const timer = setTimeout(() => {
        setShowAnswer(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [answered, showAnswer]);

  // Simula admin liberando continuar após 2 segundos
  useEffect(() => {
    if (showAnswer && !canContinue) {
      const timer = setTimeout(() => {
        setCanContinue(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showAnswer, canContinue]);

  if (!currentQuestion) return <div>Carregando perguntas...</div>;

  const getAnswerDisplay = () => {
    if (currentQuestion.type === "true-false") {
      return userAnswers[currentQuestion.id] ? "Verdadeiro" : "Falso";
    }
    return currentQuestion.options?.[userAnswers[currentQuestion.id]];
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-6 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8">
        {/* Header com Progresso e Timer */}
        <div className="mb-8 flex justify-between items-start gap-4">
          {/* Progresso */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-700">
                Pergunta {currentIndex + 1} de {questions.length}
              </h3>
              <span className="text-xs font-semibold text-gray-500">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Timer no canto */}
          <div className="text-right">
            <div className="flex items-center gap-1 mb-2">
              <Timer className="w-4 h-4 text-slate-600" />
              <span
                className={`text-sm font-bold ${
                  timeExpired
                    ? "text-red-600"
                    : timeLeft <= 5
                      ? "text-orange-600"
                      : "text-green-600"
                }`}
              >
                {timeLeft}s
              </span>
            </div>
            <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  timeExpired
                    ? "bg-red-500"
                    : timeLeft <= 5
                      ? "bg-orange-500"
                      : "bg-green-500"
                }`}
                style={{ width: `${timePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Pergunta */}
        <h2 className="text-2xl font-bold text-gray-900 mb-8">
          {currentQuestion.text}
        </h2>

        {!questionStarted && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              Aguardando admin liberar para responder...
            </AlertDescription>
          </Alert>
        )}

        {currentQuestion.type === "true-false" && (
          <div className="grid grid-cols-2 gap-4 mb-8">
            <Button
              disabled={!questionStarted || answered || timeExpired}
              onClick={() => handleAnswer(true)}
              variant={
                userAnswers[currentQuestion.id] === true ? "default" : "outline"
              }
              className="h-24 text-lg font-semibold"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Verdadeiro
            </Button>
            <Button
              disabled={!questionStarted || answered || timeExpired}
              onClick={() => handleAnswer(false)}
              variant={
                userAnswers[currentQuestion.id] === false
                  ? "default"
                  : "outline"
              }
              className="h-24 text-lg font-semibold"
            >
              <AlertCircle className="w-5 h-5 mr-2" />
              Falso
            </Button>
          </div>
        )}

        {currentQuestion.type === "multiple-choice" && (
          <div className="grid gap-3 mb-8">
            {currentQuestion.options?.map((option, index) => (
              <Button
                key={index}
                disabled={!questionStarted || answered || timeExpired}
                onClick={() => handleAnswer(index)}
                variant={
                  userAnswers[currentQuestion.id] === index
                    ? "default"
                    : "outline"
                }
                className="h-14 text-base font-semibold justify-start"
              >
                <span className="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center mr-3 text-sm">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </Button>
            ))}
          </div>
        )}

        {timeExpired && !answered && (
          <Alert
            variant="destructive"
            className="mb-6 bg-red-50 border-red-200"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tempo expirado! Aguardando admin liberar resposta...
            </AlertDescription>
          </Alert>
        )}

        {answered && !showAnswer && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <Clock className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Aguardando admin liberar resposta...
            </AlertDescription>
          </Alert>
        )}

        {showAnswer && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <p className="font-semibold mb-2">
                Sua resposta:{" "}
                <span className="text-green-700">
                  {timeExpired ? "Tempo expirado" : getAnswerDisplay()}
                </span>
              </p>
              {!canContinue && (
                <p className="text-sm">Aguardando para próxima pergunta...</p>
              )}
              {canContinue && (
                <p className="text-sm">➜ Avançando para próxima pergunta...</p>
              )}
            </AlertDescription>
          </Alert>
        )}
      </Card>
    </div>
  );
};

export default StartedPage;
