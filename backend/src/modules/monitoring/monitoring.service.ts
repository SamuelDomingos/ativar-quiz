import { prisma } from "@/src/lib/prisma";

export interface MonitoringData {
  totalParticipants: number;
  quizStatus: string;
  currentQuestion?: {
    id: string;
    title: string;
    order: number;
    duration: number;
  };
  answersCount?: number;
  totalOptions?: number;
}

export interface MonitoringResponse {
  success: boolean;
  data?: MonitoringData;
  error?: string;
}

export const getQuizMonitoringData = async (
  quizId: string,
): Promise<MonitoringResponse> => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        sessions: true,
      },
    });

    if (!quiz) {
      return {
        success: false,
        error: "Quiz não encontrado",
      };
    }

    const monitoringData: MonitoringData = {
      totalParticipants: quiz.sessions.length,
      quizStatus: quiz.status,
    };

    if (quiz.status === "STARTED" && quiz.currentQuestionId) {
      const currentQuestion = await prisma.question.findUnique({
        where: { id: quiz.currentQuestionId },
        include: {
          options: true,
        },
      });

      if (currentQuestion) {
        const answersCount = await prisma.userAnswer.count({
          where: {
            questionId: quiz.currentQuestionId,
            session: {
              quizId: quizId,
            },
          },
        });

        monitoringData.currentQuestion = {
          id: currentQuestion.id,
          title: currentQuestion.title,
          order: currentQuestion.order,
          duration: currentQuestion.duration,
        };

        monitoringData.answersCount = answersCount;
        monitoringData.totalOptions = currentQuestion.options.length;
      }
    }

    return {
      success: true,
      data: monitoringData,
    };
  } catch (error) {
    console.error("Erro ao buscar monitoramento do quiz:", error);
    return {
      success: false,
      error: "Erro ao processar dados de monitoramento",
    };
  }
};
