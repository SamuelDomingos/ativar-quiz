import { prisma } from "@/src/lib/prisma";

export const questionService = {
  async startQuestion(quizId: string) {
    return prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: { orderBy: { order: "asc" } },
        },
      });

      if (!quiz) {
        throw new Error("Quiz não encontrado");
      }

      if (quiz.status !== "STARTED") {
        throw new Error("Quiz não iniciado");
      }

      if (!quiz.currentQuestionId) {
        throw new Error("Nenhuma questão selecionada");
      }

      await tx.question.update({
        where: {
          id: quiz.currentQuestionId,
        },
        data: {
          started: true,
          questionStartedAt: new Date(),
        },
      });

      return {
        questionId: quiz.currentQuestionId,
        startedAt: new Date(),
      };
    });
  },

  async nextQuestion(quizId: string) {
    return prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: { orderBy: { order: "asc" } },
        },
      });

      if (!quiz) {
        throw new Error("Quiz não encontrado");
      }

      if (quiz.status !== "STARTED") {
        throw new Error("Quiz não está em andamento");
      }

      const currentIndex = quiz.questions.findIndex(
        (q) => q.id === quiz.currentQuestionId,
      );

      const next = quiz.questions[currentIndex + 1];

      if (!next) {
        await tx.quiz.update({
          where: { id: quizId },
          data: {
            status: "FINISHED",
            currentQuestionId: null
          },
        });

        return { finished: true };
      }

      await tx.quiz.update({
        where: { id: quizId },
        data: {
          currentQuestionId: next.id,
        },
      });

      return {
        questionId: next.id,
        ready: true,
      };
    });
  },
};
