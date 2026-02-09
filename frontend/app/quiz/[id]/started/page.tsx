"use client";

import { useParams } from "next/navigation";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuizId } from "@/hooks/useQuiz";
import { useUserControl } from "./_hooks/useUserControl";
import { Spinner } from "@/components/ui/spinner";

const ParticipantQuizPage = () => {
  const params = useParams();
  const quizId = params.id as string;

  const { data: quiz, isLoading: quizLoading } = useQuizId(quizId);
  console.log(quiz);
  

  const {
    selectedAnswerId,
    hasAnswered,
    setSelectedAnswerId,
    handleSubmitAnswer,
    isSubmitting,
  } = useUserControl({
    sessionId: quizId,
    currentQuestionId: quiz?.currentQuestionId || "",
  });

  const currentQuestion = quiz?.questions?.find(
    (q) => q.id === quiz.currentQuestionId,
  );

  const calculateTimeLeft = () => {
    if (!quiz?.questionStartedAt || !currentQuestion?.duration) return 0;

    const startTime = new Date(quiz.questionStartedAt).getTime();
    const now = new Date().getTime();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = currentQuestion.duration - elapsed;

    return Math.max(0, remaining);
  };

  const timeLeft = calculateTimeLeft();
  const timePercentage = currentQuestion?.duration
    ? (timeLeft / currentQuestion.duration) * 100
    : 0;

  const currentQuestionIndex =
    quiz?.questions?.findIndex((q) => q.id === quiz.currentQuestionId) ?? -1;

  const totalQuestions = quiz?.questions?.length || 0;

  if (quizLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner />
          <p className="text-muted-foreground">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (quiz?.status === "FINISHED") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>{quiz.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Quiz finalizado! Obrigado por participar.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>{quiz?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Aguardando a próxima pergunta...
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {quiz?.title}
            </h1>
            {quiz?.description && (
              <p className="text-muted-foreground mt-1">{quiz.description}</p>
            )}
          </div>
          <Badge variant="outline" className="text-base px-4 py-2">
            {currentQuestionIndex + 1}/{totalQuestions}
          </Badge>
        </div>

        <Progress
          value={((currentQuestionIndex + 1) / totalQuestions) * 100}
          className="h-2"
        />
      </div>

      <div className="max-w-2xl mx-auto">
        <Card className="border-border shadow-lg mb-6">
          <CardHeader className="pb-6 border-b border-border">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">
                  {currentQuestion.title}
                </CardTitle>
                <CardDescription>Selecione uma opção abaixo</CardDescription>
              </div>

              {/* Timer */}
              <div className="text-center shrink-0">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock
                    className={`w-4 h-4 ${timeLeft <= 10 ? "text-red-500" : "text-primary"}`}
                  />
                </div>
                <p
                  className={`text-3xl font-bold ${timeLeft <= 10 ? "text-red-500" : "text-primary"}`}
                >
                  {timeLeft}s
                </p>
                <Progress value={timePercentage} className="h-1 mt-2 w-24" />
              </div>
            </div>
          </CardHeader>

          {/* Opções */}
          <CardContent className="pt-6 space-y-3">
            {currentQuestion.options
              ?.sort((a, b) => a.order - b.order)
              .map((option, index) => (
                <button
                  key={option.id}
                  onClick={() => {
                    if (!hasAnswered && timeLeft > 0) {
                      setSelectedAnswerId(option.id);
                    }
                  }}
                  disabled={hasAnswered || isSubmitting || timeLeft === 0}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedAnswerId === option.id
                      ? "border-primary bg-primary/10 shadow-md"
                      : "border-border hover:border-primary/50 hover:shadow-sm"
                  } ${hasAnswered || timeLeft === 0 ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold flex-shrink-0 ${
                        selectedAnswerId === option.id
                          ? "border-primary bg-primary text-white"
                          : "border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="font-medium text-base flex-1">
                      {option.label}
                    </span>
                  </div>
                </button>
              ))}
          </CardContent>
        </Card>

        {/* Alerta se tempo acabou */}
        {timeLeft === 0 && !hasAnswered && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Tempo esgotado! Aguardando próxima pergunta...
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta se não respondeu */}
        {!hasAnswered && !selectedAnswerId && timeLeft > 0 && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Selecione uma opção para responder a pergunta
            </AlertDescription>
          </Alert>
        )}

        {/* Botão Responder */}
        {!hasAnswered && timeLeft > 0 ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={!selectedAnswerId || isSubmitting}
            size="lg"
            className="w-full"
          >
            {isSubmitting ? "Enviando..." : "Responder"}
          </Button>
        ) : hasAnswered ? (
          <div className="flex flex-col gap-3">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Resposta registrada com sucesso! Aguardando próxima pergunta...
              </AlertDescription>
            </Alert>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ParticipantQuizPage;
