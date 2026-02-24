import { prisma } from "@/src/lib/prisma";

export async function markAnswer(
  sessionId: string,
  questionId: string,
  optionId: string,
) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.quizSession.findUnique({
      where: { id: sessionId },
      include: { quiz: true },
    });

    if (!session) {
      throw new Error("Sessão inválida");
    }

    if (session.quiz.currentQuestionId !== questionId) {
      throw new Error("Questão não está ativa");
    }

    const option = await tx.questionOption.findUnique({
      where: { id: optionId },
    });

    if (!option) {
      throw new Error("Opção inválida");
    }

    const answer = await tx.userAnswer.upsert({
      where: {
        sessionId_questionId: { sessionId, questionId },
      },
      update: {
        optionId,
        answeredAt: new Date(),
      },
      create: {
        sessionId,
        questionId,
        optionId,
        answeredAt: new Date(),
      },
    });

    return {
      session,
      answer,
    };
  });
}
