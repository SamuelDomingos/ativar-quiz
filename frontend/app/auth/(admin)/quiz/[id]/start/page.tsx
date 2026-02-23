"use client";

import { useParams } from "next/navigation";
import {
  Users,
  ChevronRight,
  Play,
  PlayCircle,
  AlertCircle,
  ChevronLeft,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuizMonitoring } from "@/hooks/useQuizMonitoring";
import { useQuizControl } from "./_hooks/useQuizControl";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import CardCurrentQuestion from "./_components/cardCurrentQuestion";
import { formatTime, getTimeColor } from "@/lib/utils";

export default function QuizStartPage() {
  const params = useParams();
  const id = params.id as string;

  const quizControl = useQuizControl(id);

  const { monitoringData, isLoading, timeRemaining } = useQuizMonitoring(id);

  const currentQuestionId = monitoringData?.data?.currentQuestion?.id ?? null;

  if (isLoading) {
    return (
      <div className="min-h-screen from-background via-background to-background flex items-center justify-center">
        <div className="text-center">
          <Spinner />
          <p className="text-muted-foreground">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (!monitoringData || !monitoringData.data) {
    return (
      <div className="min-h-screen from-background via-background to-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Erro</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                Não foi possível carregar os dados do quiz.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalParticipants = monitoringData?.data?.totalParticipants || 0;
  const answeredCount = monitoringData?.data?.answersCount || 0;
  const totalDuration = monitoringData?.data?.currentQuestion?.duration ?? 0;

  return (
    <div className="min-h-screen from-background via-background to-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Pergunta{" "}
                {monitoringData?.data?.currentQuestion?.title ||
                  "Aguardando início..."}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Acompanhando em tempo real
              </p>
            </div>
            <div className="flex items-center gap-6">
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
            {monitoringData?.data?.currentQuestion ? (
              <CardCurrentQuestion
                title={monitoringData?.data?.currentQuestion?.title || ""}
                options={monitoringData?.data?.currentQuestion?.options || []}
                optionCounts={monitoringData?.data?.optionCounts || []}
              />
            ) : (
              <Card className="border-border shadow-lg">
                <CardContent className="py-16 flex flex-col items-center">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <PlayCircle className="w-7 h-7 text-primary" />
                  </div>

                  <h3 className="text-xl font-semibold mb-1">
                    Pronto para iniciar
                  </h3>

                  <p className="text-muted-foreground">
                    Inicie a pergunta quando todos estiverem preparados.
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                {!currentQuestionId && (
                  <Button
                    onClick={quizControl.handleNextQuestion}
                    disabled={quizControl.isLoading}
                    size="lg"
                    className="flex-1"
                    variant="default"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Quiz
                  </Button>
                )}

                {currentQuestionId && (
                  <Button
                    onClick={quizControl.handleBackQuestion}
                    disabled={quizControl.isLoading}
                    size="lg"
                    className="flex-1"
                  >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Voltar
                  </Button>
                )}

                {currentQuestionId && (
                  <Button
                    onClick={quizControl.handleNextQuestion}
                    disabled={quizControl.isLoading}
                    size="lg"
                    className="flex-1"
                  >
                    Próxima
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
                {totalDuration > 0 && (
                  <div className="flex flex-col items-center justify-center py-4 border border-border rounded-xl">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">
                      Tempo restante
                    </p>
                    <p
                      className={`text-5xl font-bold tabular-nums transition-colors ${getTimeColor(timeRemaining, totalDuration)}`}
                    >
                      {formatTime(timeRemaining)}
                    </p>
                    <div className="w-full mt-3 px-4">
                      <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(100, (timeRemaining / totalDuration) * 100)}%`,
                            backgroundColor: "currentColor",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

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
