import { prisma } from "@/src/lib/prisma";
import { Question, QuestionOption } from "@/src/lib/prisma/browser";

export interface MonitoringData {
  totalParticipants: number;
  quizStatus: string;
  questionStartedAt?: Date;
  currentQuestion?: Question & {
    options: QuestionOption[];
  };

  answersCount?: number;
  optionCounts?: { optionId: string; count: number }[];
  userAnswerOptionId?: string | null;
}

export interface MonitoringResponse {
  success: boolean;
  data?: MonitoringData;
  error?: string;
}

export const getQuizMonitoringData = async (
  quizId: string,
  sessionId?: string,
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

        const optionCounts = await prisma.userAnswer.groupBy({
          by: ["optionId"],
          where: {
            questionId: quiz.currentQuestionId,
            session: { quizId },
          },
          _count: { optionId: true },
        });

        if (sessionId) {

          const userAnswer = await prisma.userAnswer.findUnique({
            where: {
              sessionId_questionId: {
                sessionId,
                questionId: quiz.currentQuestionId,
              },
            },
          });
          monitoringData.userAnswerOptionId = userAnswer?.optionId ?? null;
        }

        monitoringData.currentQuestion = currentQuestion;
        monitoringData.questionStartedAt = quiz.questionStartedAt || undefined;
        monitoringData.answersCount = answersCount;
        monitoringData.optionCounts = optionCounts.map(
          (item: { optionId: string; _count: { optionId: number } }) => ({
            optionId: item.optionId,
            count: item._count.optionId,
          }),
        );
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
