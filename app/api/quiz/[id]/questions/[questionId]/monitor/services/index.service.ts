import { prisma } from "@/lib/prisma";

export interface ParticipantData {
  id: string;
  name: string;
  answered: boolean;
}

export interface AnswerStatistic {
  optionId: string;
  optionLabel: string;
  isCorrect: boolean;
  count: number;
  percentage: number;
}

export interface QuizMonitoringData {
  totalParticipants: number;
  answeredCount: number;
  participants: ParticipantData[];
  answerStatistics: AnswerStatistic[];
}

export interface QuizMonitoringResponse {
  success: boolean;
  data?: QuizMonitoringData;
  error?: string;
}

export const getQuestionMonitoringData = async (
  quizId: string,
  questionId: string,
): Promise<QuizMonitoringResponse> => {
  try {
    const sessions = await prisma.quizSession.findMany({
      where: { quizId },
      include: {
        answers: {
          where: { questionId },
          include: {
            option: true,
          },
        },
      },
    });

    if (sessions.length === 0) {
      return {
        success: false,
        error: "Nenhuma sessão encontrada",
      };
    }

    const question = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        options: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!question) {
      return {
        success: false,
        error: "Pergunta não encontrada",
      };
    }

    const participants: ParticipantData[] = sessions.map((session) => ({
      id: session.id,
      name: session.userName,
      answered: session.answers.length > 0,
    }));

    const answeredCount = participants.filter((p) => p.answered).length;

    const answerStatistics: AnswerStatistic[] = question.options.map(
      (option) => {
        const count = sessions.filter((session) =>
          session.answers.some((answer) => answer.optionId === option.id),
        ).length;

        return {
          optionId: option.id,
          optionLabel: option.label,
          isCorrect: option.isCorrect,
          count,
          percentage: answeredCount > 0 ? (count / answeredCount) * 100 : 0,
        };
      },
    );

    return {
      success: true,
      data: {
        totalParticipants: sessions.length,
        answeredCount,
        participants,
        answerStatistics,
      },
    };
  } catch (error) {
    console.error("Erro ao buscar monitoramento da pergunta:", error);
    return {
      success: false,
      error: "Erro ao processar dados de monitoramento",
    };
  }
};

export const getQuestionAnswersDetail = async (questionId: string) => {
  try {
    const answers = await prisma.userAnswer.findMany({
      where: { questionId },
      include: {
        session: {
          select: {
            userName: true,
          },
        },
        option: {
          select: {
            label: true,
            isCorrect: true,
          },
        },
      },
    });

    return {
      success: true,
      data: answers,
    };
  } catch (error) {
    console.error("Erro ao buscar detalhes das respostas:", error);
    return {
      success: false,
      error: "Erro ao processar",
    };
  }
};
