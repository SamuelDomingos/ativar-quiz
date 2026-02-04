import { prisma } from "@/lib/prisma";

export const markAnswerService = {
  async markAnswer(
    sessionId: string,
    questionId: string,
    optionId: string,
  ) {
    try {
      const session = await prisma.quizSession.findUnique({
        where: { id: sessionId },
        include: {
          quiz: {
            include: {
              questions: { where: { id: questionId } },
            },
          },
        },
      });

      if (!session) {
        return { success: false, error: "Sessão inválida" };
      }

      if (session.quiz.currentQuestionId !== questionId) {
        return { success: false, error: "Questão não está mais ativa" };
      }

      const question = session.quiz.questions[0];
      const elapsed = Math.floor(
        (Date.now() - (session.quiz.questionStartedAt?.getTime() || 0)) / 1000,
      );

      if (elapsed > question.duration) {
        return { success: false, error: "Tempo esgotado" };
      }

      await prisma.userAnswer.upsert({
        where: {
          sessionId_questionId: { sessionId, questionId },
        },
        update: { optionId, answeredAt: new Date() },
        create: { sessionId, questionId, optionId },
      });

      return { success: true };
    } catch (error) {
      return { success: false, error: `Erro ao salvar resposta: ${error}` };
    }
  },
};
