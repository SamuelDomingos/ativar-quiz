import { prisma } from "@/src/lib/prisma";

export async function markAnswer(
  sessionId: string,
  questionId: string,
  optionId: string,
) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.quizSession.findUnique({
      where: { id: sessionId },
      include: {
        quiz: true,
      },
    });

    if (!session) {
      throw new Error("Sessão inválida");
    }

    if (session.quiz.currentQuestionId !== questionId) {
      throw new Error("Questão não está ativa");
    }

    const question = await tx.question.findUnique({
      where: { id: questionId },
    });

    const elapsed =
      (Date.now() - (question?.questionStartedAt?.getTime() ?? 0)) / 1000;

    if (elapsed > question!.duration) {
      throw new Error("Tempo esgotado");
    }

    await tx.userAnswer.upsert({
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
      },
    });

    return true;
  });
}
