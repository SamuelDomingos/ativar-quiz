import { QuizStatus } from "@/src/lib/generated/prisma/enums";
import { prisma } from "@/src/lib/prisma";

export type QuizCommand = "open" | "start" | "pause";

export async function quizService({
  idQuiz,
  command,
}: {
  idQuiz: string;
  command: QuizCommand;
}) {
  const quiz = await prisma.quiz.findUnique({
    where: { id: idQuiz },
  });

  if (!quiz) {
    throw new Error("Quiz não encontrado");
  }

  switch (command) {
    case "open":
      return quizController({ idQuiz, command: "WAITING" });

    case "start":
      return quizController({ idQuiz, command: "STARTED" });

    case "pause":
      return quizController({ idQuiz, command: "PAUSED" });

    default:
      throw new Error("Comando inválido");
  }
}

const quizController = async ({
  idQuiz,
  command,
}: {
  idQuiz: string;
  command: QuizStatus;
}) => {
  const quiz = await prisma.quiz.update({
    where: { id: idQuiz },
    data: { status: command },
    include: { sessions: true },
  });

if (command === "PAUSED") {
  await prisma.$transaction(async (tx) => {
    // 1️⃣ Buscar todas as sessões do quiz
    const sessions = await tx.quizSession.findMany({
      where: { quizId: idQuiz },
      select: { id: true },
    });

    const sessionIds = sessions.map((s) => s.id);

    // 2️⃣ Deletar todas as respostas dessas sessões
    await tx.userAnswer.deleteMany({
      where: {
        sessionId: { in: sessionIds },
      },
    });

    // 3️⃣ Agora deletar as sessões
    await tx.quizSession.deleteMany({
      where: { quizId: idQuiz },
    });

    // 4️⃣ Atualizar status do quiz
    await tx.quiz.update({
      where: { id: idQuiz },
      data: { status: "PAUSED" },
    });
  });

  return {
    status: "PAUSED",
    activeSessions: 0,
  };
}

  return {
    status: quiz.status,
    activeSessions: quiz.sessions.length,
  };
};
