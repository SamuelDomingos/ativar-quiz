import { prisma } from "@/lib/prisma";

type QuizCommand = "open" | "start" | "pause";

interface QuizServiceResponse {
  success: boolean;
  message: string;
  data?: any;
  timestamp: string;
}

export const quizService = async ({
  idQuiz,
  status,
}: {
  idQuiz: string;
  status: QuizCommand;
}): Promise<QuizServiceResponse> => {
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

    switch (status) {
      case "open":
        return await handleAbrir(idQuiz);

      case "start":
        return await handleIniciar(idQuiz);

      case "pause":
        return await handlePausar(idQuiz);

      default:
        return {
          success: false,
          message: "Comando inválido. Use: open, start ou pause",
          timestamp: new Date().toISOString(),
        };
    }
  } catch (error) {
    console.error("Erro no quizService:", error);
    return {
      success: false,
      message: "Erro ao processar o comando",
      timestamp: new Date().toISOString(),
    };
  }
};

async function handleAbrir(idQuiz: string): Promise<QuizServiceResponse> {
  const updatedQuiz = await prisma.quiz.update({
    where: { id: idQuiz },
    data: { status: "WAITING" },
    include: { sessions: true },
  });

  return {
    success: true,
    message: "Quiz aberto e pronto para receber participantes",
    data: {
      quizStatus: updatedQuiz.status,
      activeSessions: updatedQuiz.sessions.length,
    },
    timestamp: new Date().toISOString(),
  };
}

async function handleIniciar(idQuiz: string): Promise<QuizServiceResponse> {
  const updatedQuiz = await prisma.quiz.update({
    where: { id: idQuiz },
    data: { status: "STARTED" },
    include: {
      sessions: true,
    },
  });

  return {
    success: true,
    message: "Quiz iniciado com sucesso",
    data: {
      quizStatus: updatedQuiz.status,
      participantsCount: updatedQuiz.sessions.length,
    },
    timestamp: new Date().toISOString(),
  };
}

async function handlePausar(idQuiz: string): Promise<QuizServiceResponse> {
  const updatedQuiz = await prisma.quiz.update({
    where: { id: idQuiz },
    data: { status: "PAUSED" },
    include: { sessions: true },
  });

  return {
    success: true,
    message: "Quiz pausado com sucesso",
    data: {
      quizStatus: updatedQuiz.status,
      activeSessions: updatedQuiz.sessions.length,
    },
    timestamp: new Date().toISOString(),
  };
}

export const deleteQuizSession = async (
  sessionId: string,
): Promise<QuizServiceResponse> => {
  try {
    await prisma.quizSession.delete({
      where: { id: sessionId },
    });

    return {
      success: true,
      message: "Sessão removida com sucesso",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      success: false,
      message: `Erro ao remover sessão: ${error instanceof Error ? error.message : "Erro desconhecido"}`,
      timestamp: new Date().toISOString(),
    };
  }
};
