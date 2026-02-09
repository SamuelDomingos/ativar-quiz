import { prisma } from "@/src/lib/prisma";

export async function joinQuizService({
  idQuiz,
  userName,
}: {
  idQuiz: string;
  userName: string;
}) {
  return prisma.$transaction(async (tx) => {
    const quiz = await tx.quiz.findUnique({
      where: { id: idQuiz },
    });

    if (!quiz) {
      throw new Error("Quiz não encontrado");
    }

    if (quiz.status === "FINISHED") throw new Error("Quiz finalizado");

    if (quiz.status === "PAUSED") throw new Error("Quiz pausado");

    if (!["WAITING", "STARTED"].includes(quiz.status))
      throw new Error("Quiz indisponível");

    const existingSession = await tx.quizSession.findFirst({
      where: {
        quizId: idQuiz,
        userName,
      },
    });

    if (existingSession) {
      return existingSession;
    }

    const session = await tx.quizSession.create({
      data: {
        quizId: idQuiz,
        userName,
      },
    });

    return session;
  });
}
