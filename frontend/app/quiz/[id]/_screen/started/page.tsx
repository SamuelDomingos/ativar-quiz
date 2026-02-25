"use client";

import { useParams } from "next/navigation";
import { CheckCircle2, Clock, AlertCircle, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuizMonitoring } from "@/hooks/useQuizMonitoring";
import { useUserControl } from "../../_hooks/useUserControl";
import { Spinner } from "@/components/ui/spinner";
import HeaderStarted from "./_components/headerStarted";
import CardQuestion from "./_components/cardQuestion";

const ParticipantQuizPage = () => {
  const params = useParams();
  const id = params.id as string;

  const { monitoringData, timeRemaining, isLoading } = useQuizMonitoring(id);

  const currentQuestion = monitoringData?.data?.currentQuestion;

  const {
    selectedAnswerId,
    isSubmitting,
    isLoadingCurrentAnswer,
    selectAnswer,
  } = useUserControl({
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

  if (!currentQuestion) {
    return (
      <div className="min-h-screen from-background via-background to-background flex items-center justify-center">
        <Card className="border-border shadow-lg">
          <CardContent className="py-16 flex flex-col items-center">
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Clock className="w-7 h-7 text-primary" />
            </div>

            <h3 className="text-xl font-semibold mb-1">
              Aguardando próxima pergunta
            </h3>

            <p className="text-muted-foreground text-center">
              Fique tranquilo, a próxima pergunta comecara em breve.
            </p>

            <div className="mt-6 flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span>
                <span className="text-foreground font-semibold">
                  {monitoringData?.data?.totalParticipants ?? 0}
                </span>{" "}
                participante
                {monitoringData?.data?.totalParticipants !== 1 ? "s" : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen from-background via-background to-background p-4 md:p-6">
      <HeaderStarted
        monitoringData={monitoringData}
        currentQuestion={currentQuestion}
      />

      <div className="max-w-2xl mx-auto">
        {!currentQuestion ? (
          <Card className="border-border shadow-lg mb-6 overflow-hidden">
            <CardHeader className="pb-6 border-b border-border">
              <CardTitle className="text-2xl">Quiz Encerrado 🎉</CardTitle>
              <CardDescription>Você chegou ao fim!</CardDescription>
            </CardHeader>

            <CardContent className="pt-10 pb-12">
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <CheckCircle2 className="w-16 h-16 text-primary" />

                <h3 className="text-xl font-semibold tracking-tight">
                  Obrigado por participar!
                </h3>

                <p className="text-muted-foreground max-w-md">
                  Todas as perguntas foram respondidas. Esperamos que tenha
                  aproveitado o quiz!
                </p>
              </div>
            </CardContent>
          </Card>
        ) : currentQuestion && !isLoadingCurrentAnswer ? (
          <CardQuestion
            currentQuestion={currentQuestion}
            timeRemaining={timeRemaining}
            selectAnswer={selectAnswer}
            userAnswerOptionId={selectedAnswerId}
            isSubmitting={isSubmitting}
          />
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
                  Aguardando iniciar a pergunta
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
        {currentQuestion?.duration === 0 && (
          <Alert className="mb-6 bg-red-50 border-red-200">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Tempo esgotado! Aguardando próxima pergunta...
            </AlertDescription>
          </Alert>
        )}

        {/* Alerta se não respondeu */}
        {currentQuestion && !selectAnswer && timeRemaining > 0 && (
          <Alert className="mb-6 bg-amber-50 border-amber-200">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Selecione uma opção para responder a pergunta
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default ParticipantQuizPage;
