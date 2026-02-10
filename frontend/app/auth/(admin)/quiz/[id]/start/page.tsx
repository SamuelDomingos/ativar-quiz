"use client";

import { useParams } from "next/navigation";
import { Users, CheckCircle2, ChevronRight, Timer, Play } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuizMonitoring } from "@/hooks/useQuizMonitoring";
import { useQuizControl } from "./_hooks/useQuizControl";
import { useQuizId } from "@/hooks/useQuiz";
import { Spinner } from "@/components/ui/spinner";

export default function QuizStartPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: quiz, isLoading: quizLoading } = useQuizId(id);

  const quizControl = useQuizControl(id);

  const currentQuestion = quiz?.questions?.find(
    (q) => q.id === quiz.currentQuestionId,
  );

  const { monitoringData } = useQuizMonitoring(id);

  if (quizLoading) {
    return (
      <div className="min-h-screen from-background via-background to-background flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="text-muted-foreground">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen from-background via-background to-background flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              Quiz não encontrado
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestionIndex = quiz.questions.findIndex(
    (q) => q.id === quiz.currentQuestionId,
  );

  const totalParticipants = monitoringData?.data?.totalParticipants || 0;
  const answeredCount = monitoringData?.data?.answeredCount || 0;
  const answerStatistics = monitoringData?.data?.answerStatistics || [];

  const progressPercentage =
    totalParticipants > 0 ? (answeredCount / totalParticipants) * 100 : 0;

  return (
    <div className="min-h-screen from-background via-background to-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Pergunta{" "}
                {currentQuestionIndex >= 0 ? currentQuestionIndex + 1 : "-"} de{" "}
                {quiz.questions.length}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Acompanhando em tempo real
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="flex items-center gap-2 justify-center mb-1">
                  <Timer className="w-4 h-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">Tempo</p>
                </div>
                <p className="text-2xl font-bold text-primary">
                  {currentQuestion ? `${currentQuestion.duration}s` : "-"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">
                  Participantes Online
                </p>
                <p className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {totalParticipants}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {currentQuestion ? (
              <Card className="border-border shadow-lg">
                <CardHeader className="pb-6 border-b border-border">
                  <div>
                    <CardTitle className="text-2xl mb-2">
                      {currentQuestion.title}
                    </CardTitle>
                    <CardDescription>
                      Resposta correta destacada em verde
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  {currentQuestion.options.map((option, index) => {
                    const stat = answerStatistics.find(
                      (s: any) => s.optionId === option.id,
                    ) || {
                      count: 0,
                      percentage: 0,
                    };

                    return (
                      <div
                        key={option.id}
                        className={`w-full p-4 rounded-lg border-2 transition-all ${
                          option.isCorrect
                            ? "border-green-500 bg-green-500/10"
                            : "border-border bg-muted/30"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                                option.isCorrect
                                  ? "border-green-600 bg-green-600 text-white"
                                  : "border-muted-foreground text-muted-foreground"
                              }`}
                            >
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="font-medium text-base">
                              {option.label}
                            </span>
                          </div>
                          {option.isCorrect && (
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 ml-12">
                          <Progress
                            value={stat.percentage}
                            className="h-2 flex-1"
                          />
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-primary">
                              {stat.count}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({stat.percentage.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ) : (
              <Card className="border-border shadow-lg">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground">
                    Aguardando início do quiz...
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                {quiz.currentQuestionId === quiz.questions[0]?.id && (
                  <Button
                    onClick={quizControl.handleStartQuiz}
                    disabled={quizControl.isLoading}
                    size="lg"
                    className="flex-1"
                    variant="default"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Quiz
                  </Button>
                )}

                {quiz.currentQuestionId && (
                  <Button
                    onClick={quizControl.handleNextQuestion}
                    disabled={!quizControl || quizControl.isLoading}
                    size="lg"
                    className="flex-1"
                  >
                    {!quizControl ? "Quiz Finalizado" : "Próxima"}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-border shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  Progresso de Respostas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">
                      Responderam
                    </p>
                    <p className="text-sm font-bold text-primary">
                      {answeredCount} / {totalParticipants}
                    </p>
                  </div>
                  <Progress value={progressPercentage} className="h-3" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {answeredCount}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Respondidas
                    </p>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 text-center">
                    <p className="text-3xl font-bold text-amber-600">
                      {Math.max(0, totalParticipants - answeredCount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pendentes
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
