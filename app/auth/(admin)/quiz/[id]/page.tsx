"use client";

import { Play, Pause, DoorOpen, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetQuizStatus } from "../../_hooks/useAdmin";
import { useControl } from "./_hooks/useControl";
import { getStatusBadge } from "./_lib/status";
import QrCode from "@/components/qrCode";
import Link from "next/link";

export default function EditQuizPage() {
  const params = useParams();
  const id = params.id as string;

  const { data, getStatus } = useGetQuizStatus(id);
  const currentStatus = data?.data.status;

  const { uploadControl, isLoading: isLoadingControl } = useControl();

  const handleControlQuiz = async (status: string) => {
    try {
      await uploadControl({ idQuiz: id, status });
      setTimeout(() => getStatus(), 500);
    } catch (error) {
      console.error("Erro ao controlar quiz:", error);
    }
  };

  const statusBadge = getStatusBadge(currentStatus || "");
  const IconComponent = statusBadge.Icon;

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-background">
      <div className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Quiz
              </h1>
              <p className="text-muted-foreground mt-1">
                Teste seus conhecimentos em diversos assuntos
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <QrCode id={id} />
          </div>

          <div className="space-y-6">
            <Card className="border-border shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Controles</CardTitle>
                <CardDescription>Gerenciar status do quiz</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground">Status</p>
                  <Badge
                    variant={statusBadge.variant}
                    className="w-full justify-center py-2 text-sm font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      {statusBadge.isActive && (
                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      )}
                      <IconComponent className="w-4 h-4" />
                      {statusBadge.label}
                    </span>
                  </Badge>
                </div>
                <div
                  className={`grid gap-2 ${
                    currentStatus === "WAITING"
                      ? "grid-cols-2"
                      : currentStatus === "STARTED"
                        ? "grid-cols-2"
                        : "grid-cols-1"
                  }`}
                >
                  {
                    (currentStatus === "PAUSED") && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="lg"
                            title="Abrir Quiz"
                            onClick={() => handleControlQuiz("open")}
                            disabled={isLoadingControl}
                            className="w-full"
                          >
                            <DoorOpen className="w-4 h-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Abrir Quiz</TooltipContent>
                      </Tooltip>
                    )}

                  {currentStatus === "WAITING" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="lg"
                          title="Iniciar Quiz"
                          onClick={() => handleControlQuiz("start")}
                          disabled={isLoadingControl}
                          className="w-full"
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Iniciar Quiz</TooltipContent>
                    </Tooltip>
                  )}

                  {currentStatus === "STARTED" && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link href={`/auth/quiz/${id}/start`}>
                          <Button
                            variant="default"
                            size="lg"
                            disabled={isLoadingControl}
                            className="w-full"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>Ir para o quiz</TooltipContent>
                    </Tooltip>
                  )}

                  {(currentStatus === "STARTED" || currentStatus === "WAITING") && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="lg"
                          title="Pausar Quiz"
                          onClick={() => handleControlQuiz("pause")}
                          disabled={isLoadingControl}
                          className="w-full"
                        >
                          <Pause className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Pausar Quiz</TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </CardContent>
            </Card>
            {(currentStatus === "WAITING" || currentStatus === "STARTED") &&
              data?.data.totalParticipants !== undefined && (
                <Card className="border-border shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Participantes</CardTitle>
                    <CardDescription>Total de pessoas no quiz</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Total</p>
                          <p className="text-2xl font-bold">
                            {data?.data.totalParticipants}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
