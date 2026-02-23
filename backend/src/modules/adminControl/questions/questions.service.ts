import { prisma } from "@/src/lib/prisma";

export const questionService = {
  async actionQuestion(quizId: string, action: "next" | "back") {
    return prisma.$transaction(async (tx) => {
      const quiz = await tx.quiz.findUnique({
        where: { id: quizId },
        include: {
          questions: {
            orderBy: { order: "asc" },
          },
        },
      });

      if (!quiz) {
        throw new Error("Quiz não encontrado");
      }

      // Primeira questão — só permitido no next
      if (!quiz.currentQuestionId) {
        if (action === "back") {
          throw new Error("Nenhuma questão foi iniciada");
        }

        const firstQuestion = quiz.questions[0];
        if (!firstQuestion) throw new Error("Quiz não possui questões.");

        await tx.quiz.update({
          where: { id: quizId },
          data: {
            currentQuestionId: firstQuestion.id,
            questionStartedAt: new Date(),
          },
        });

        return { questionId: firstQuestion.id, ready: true };
      }

      const currentQuestion = await tx.question.findUnique({
        where: { id: quiz.currentQuestionId },
      });

      if (!currentQuestion) {
        throw new Error("Questão atual não encontrada");
      }

      const currentIndex = quiz.questions.findIndex(
        (q) => q.id === currentQuestion.id,
      );

      const offset = action === "next" ? 1 : -1;
      const nextQuestionData = quiz.questions[currentIndex + offset];

      if (!nextQuestionData) {
        if (action === "back") {
          await tx.quiz.update({
            where: { id: quizId },
            data: {
              currentQuestionId: null,
              questionStartedAt: null,
            },
          });

          return { questionId: null, ready: false };
        }

        throw new Error("Não há próxima questão. Quiz finalizado.");
      }

      await tx.quiz.update({
        where: { id: quizId },
        data: {
          currentQuestionId: nextQuestionData.id,
          questionStartedAt: new Date(),
        },
      });

      return {
        questionId: nextQuestionData.id,
        ready: true,
      };
    });
  },
};
