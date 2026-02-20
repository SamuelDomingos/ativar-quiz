"use client";

import { useParams } from "next/navigation";
import { CheckCircle2, Clock, AlertCircle, Timer } from "lucide-react";
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
import { useQuizMonitoring } from "@/hooks/useQuizMonitoring";
import { useUserControl } from "./_hooks/useUserControl";
import { Spinner } from "@/components/ui/spinner";
import { ChartRadialText } from "@/components/ui/chart-radial-text";

const ParticipantQuizPage = () => {
  const params = useParams();
  const id = params.id as string;

  const { monitoringData, isLoading } = useQuizMonitoring(id);

  const currentQuestion = monitoringData?.data?.currentQuestion;
  const totalParticipants = monitoringData?.data?.totalParticipants || 0;
  const quizStatus = monitoringData?.data?.quizStatus;
  const answersCount = monitoringData?.data?.answersCount || 0;

  const {
    selectedAnswerId,
    hasAnswered,
    setSelectedAnswerId,
    handleSubmitAnswer,
    isSubmitting,
  } = useUserControl({
    sessionId: id,
    currentQuestionId: currentQuestion?.id || "",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen from-background via-background to-background flex items-center justify-center">
        <div className="text-center space-y-4">
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

  if (quizStatus === "FINISHED") {
    return (
      <div className="min-h-screen from-background via-background to-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Quiz Finalizado</CardTitle>
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
      <div className="min-h-screen from-background via-background to-background flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Aguardando...</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                Aguardando a próxima pergunta...
              </AlertDescription>
            </Alert>
            <div className="mt-4 text-sm text-muted-foreground">
              <p>Participantes: {totalParticipants}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-background via-background to-background p-4 md:p-6">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Quiz</h1>
            <p className="text-muted-foreground mt-1">
              Participantes: {totalParticipants}
            </p>
          </div>
          <Badge variant="outline" className="text-base px-4 py-2">
            Questão {currentQuestion.order}
          </Badge>
        </div>
        <Progress
          value={
            totalParticipants > 0 ? (answersCount / totalParticipants) * 100 : 0
          }
          className="h-2"
        />
      </div>

      <div className="max-w-2xl mx-auto">
        {currentQuestion.started === true ? (
          <Card className="border-border shadow-lg mb-6">
            <CardHeader className="pb-6 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {currentQuestion.title}
                  </CardTitle>
                  <CardDescription>Selecione uma opção abaixo</CardDescription>
                </div>
                <ChartRadialText
                  data={[
                    {
                      label: "tempo",
                      value: currentQuestion?.duration,
                      fill: "var(--primary)",
                    },
                  ]}
                  centerLabel="segundos"
                  config={{
                    tempo: {
                      label: "Tempo",
                      color: "hsl(var(--primary))",
                    },
                  }}
                />
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-3">
              {currentQuestion.options && currentQuestion.options.length > 0 ? (
                currentQuestion.options
                  .sort((a: any, b: any) => a.order - b.order)
                  .map((option: any, index: number) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        if (!hasAnswered && currentQuestion?.duration > 0) {
                          setSelectedAnswerId(option.id);
                        }
                      }}
                      disabled={
                        hasAnswered ||
                        isSubmitting ||
                        currentQuestion?.duration === 0
                      }
                      className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                        selectedAnswerId === option.id
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50 hover:shadow-sm"
                      } ${hasAnswered || currentQuestion?.duration === 0 ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
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
                  ))
              ) : (
                <p className="text-muted-foreground">Carregando opções...</p>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border shadow-lg mb-6 overflow-hidden">
            <CardHeader className="pb-6 border-b border-border">
              <CardTitle className="text-2xl">Prepare-se...</CardTitle>
              <CardDescription>
                Uma nova pergunta está prestes a aparecer
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-10 pb-12">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-8">
                  <Spinner className="w-16 h-16" />
                </div>

                <h3 className="text-xl font-semibold mb-2 tracking-tight">
                  Aguardando iníciar a pergunta
                </h3>

                <p className="text-muted-foreground max-w-md">
                  Fique atento — quando a pergunta aparecer, você terá poucos
                  segundos para responder.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alerta se tempo acabou */}
        {currentQuestion?.duration === 0 && !hasAnswered && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Tempo esgotado! Aguardando próxima pergunta...
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta se não respondeu */}
        {currentQuestion.started === true &&
          !hasAnswered &&
          !selectedAnswerId &&
          currentQuestion?.duration > 0 && (
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700">
                Selecione uma opção para responder a pergunta
              </AlertDescription>
            </Alert>
          )}

        {/* Botão Responder */}
        {currentQuestion.started === true && currentQuestion?.duration > 0 ? (
          <Button
            onClick={handleSubmitAnswer}
            disabled={isSubmitting}
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
