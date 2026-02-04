import { prisma } from "@/lib/prisma";

export const quizControlService = {
  async startQuiz(quizId: string) {
    try {
      const firstQuestion = await prisma.question.findFirst({
        where: { quizId },
        orderBy: { order: "asc" },
      });

      if (!firstQuestion) {
        return { success: false, error: "Quiz sem questões" };
      }

      await prisma.quiz.update({
        where: { id: quizId },
        data: {
          status: "STARTED",
          currentQuestionId: firstQuestion.id,
          questionStartedAt: new Date(),
        },
      });

      return { success: true, data: { questionId: firstQuestion.id } };
    } catch (error) {
      return { success: false, error: `Erro ao iniciar quiz: ${error}` };
    }
  },

  async nextQuestion(quizId: string) {
    try {
      const quiz = await prisma.quiz.findUnique({
        where: { id: quizId },
        include: { questions: { orderBy: { order: "asc" } } },
      });

      if (!quiz) {
        return { success: false, error: "Quiz não encontrado" };
      }

      const currentIndex = quiz.questions.findIndex(
        (q) => q.id === quiz.currentQuestionId,
      );
      const nextQuestion = quiz.questions[currentIndex + 1];

      if (!nextQuestion) {
        await prisma.quiz.update({
          where: { id: quizId },
          data: {
            status: "FINISHED",
            currentQuestionId: null,
            questionStartedAt: null,
          },
        });
        return { success: true, data: { finished: true } };
      }

      await prisma.quiz.update({
        where: { id: quizId },
        data: {
          currentQuestionId: nextQuestion.id,
          questionStartedAt: new Date(),
        },
      });

      return { success: true, data: { questionId: nextQuestion.id } };
    } catch (error) {
      return { success: false, error: `Erro ao avançar questão: ${error}` };
    }
  },
};
