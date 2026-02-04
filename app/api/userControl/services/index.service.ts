import { prisma } from "@/lib/prisma";

interface JoinQuizInput {
  idQuiz: string;
  userName: string;
}

interface ServiceResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export const joinQuizService = async ({
  idQuiz,
  userName,
}: JoinQuizInput): Promise<ServiceResponse> => {
  try {
    if (!idQuiz || !userName) {
      return {
        success: false,
        message: "idQuiz e userName são obrigatórios",
        timestamp: new Date().toISOString(),
      };
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: idQuiz },
    });

    if (!quiz) {
      return {
        success: false,
        message: "Quiz não encontrado",
        timestamp: new Date().toISOString(),
      };
    }

    if (quiz.status === "FINISHED") {
      return {
        success: false,
        message: "Este quiz já foi finalizado e não está mais disponível",
        timestamp: new Date().toISOString(),
      };
    }

    if (quiz.status === "PAUSED") {
      return {
        success: false,
        message: "O quiz foi pausado e não está recebendo novos participantes",
        timestamp: new Date().toISOString(),
      };
    }

    if (quiz.status !== "WAITING" && quiz.status !== "STARTED") {
      return {
        success: false,
        message: "Quiz não está disponível para participação",
        timestamp: new Date().toISOString(),
      };
    }

    const existingSession = await prisma.quizSession.findFirst({
      where: {
        quizId: idQuiz,
        userName,
      },
    });

    if (existingSession) {
      return {
        success: true,
        message: "Você já possui uma sessão ativa neste quiz",
        data: {
          sessionId: existingSession.id,
        },
        timestamp: new Date().toISOString(),
      };
    }

    const newSession = await prisma.quizSession.create({
      data: {
        quizId: idQuiz,
        userName,
      },
    });

    return {
      success: true,
      message: `Bem-vindo ${userName}! Sessão criada com sucesso`,
      data: {
        sessionId: newSession.id,
        userName: newSession.userName,
        quizId: newSession.quizId,
        joinedAt: newSession.joinedAt,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao entrar no quiz:", error);
    return {
      success: false,
      message: "Erro ao processar sua entrada no quiz",
      timestamp: new Date().toISOString(),
    };
  }
};

export const validateQuizAccess = async (
  idQuiz: string,
): Promise<ServiceResponse> => {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id: idQuiz },
    });

    if (!quiz) {
      return {
        success: false,
        message: "Quiz não encontrado",
        timestamp: new Date().toISOString(),
      };
    }

    const canAccess = quiz.status === "WAITING" || quiz.status === "STARTED";

    const participants = await prisma.quizSession.count({
      where: {
        quizId: idQuiz,
      },
    });

    return {
      success: canAccess,
      message: canAccess
        ? "Quiz disponível para acesso"
        : `Quiz indisponível - Status: ${quiz.status}`,
      data: {
        quizId: quiz.id,
        status: quiz.status,
        canAccess,
        totalParticipants: participants,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Erro ao validar acesso ao quiz:", error);
    return {
      success: false,
      message: "Erro ao validar acesso ao quiz",
      timestamp: new Date().toISOString(),
    };
  }
};
