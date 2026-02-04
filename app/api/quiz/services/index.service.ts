import { prisma } from "@/lib/prisma";
import { QuestionType, QuizStatus } from "@/lib/generated/prisma/enums";

interface CreateQuizInput {
  title: string;
  description?: string;
  questions: Array<{
    title: string;
    type: "TRUE_FALSE" | "SINGLE_CHOICE";
    order: number;
    duration: number;
    options: Array<{
      label: string;
      isCorrect: boolean;
      order: number;
    }>;
  }>;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const quizService = {
  async post(data: CreateQuizInput): Promise<ServiceResponse<any>> {
    try {
      const { title, description, questions } = data;

      if (!title || title.trim().length === 0) {
        return {
          success: false,
          error: "Título é obrigatório",
        };
      }

      if (!questions || questions.length === 0) {
        return {
          success: false,
          error: "Pelo menos uma pergunta é obrigatória",
        };
      }

      for (const question of questions) {
        if (!question.title || question.title.trim().length === 0) {
          return {
            success: false,
            error: "Todas as perguntas devem ter um título",
          };
        }

        if (!["TRUE_FALSE", "SINGLE_CHOICE"].includes(question.type)) {
          return {
            success: false,
            error: "Tipo de pergunta inválido",
          };
        }

        if (!Array.isArray(question.options) || question.options.length === 0) {
          return {
            success: false,
            error: "Cada pergunta deve ter pelo menos uma opção",
          };
        }

        if (question.options.filter((o) => o.isCorrect).length === 0) {
          return {
            success: false,
            error: "Cada pergunta deve ter pelo menos uma resposta correta",
          };
        }

        if (!question.duration || question.duration < 1) {
          return {
            success: false,
            error: "Duração da pergunta deve ser maior que 0",
          };
        }
      }

      const quiz = await prisma.quiz.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          status: "WAITING",
          questions: {
            create: questions.map((question) => ({
              title: question.title,
              type: question.type,
              order: question.order,
              duration: question.duration,
              options: {
                create: question.options.map((option) => ({
                  label: option.label,
                  isCorrect: option.isCorrect,
                  order: option.order,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      return {
        success: true,
        data: quiz,
      };
    } catch (error) {
      console.error("Erro ao criar quiz:", error);
      return {
        success: false,
        error: "Erro ao criar quiz",
      };
    }
  },

  async getAll(): Promise<ServiceResponse<any>> {
    try {
      const quizzes = await prisma.quiz.findMany({
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return {
        success: true,
        data: quizzes,
      };
    } catch (error) {
      console.error("Erro ao buscar quizzes:", error);
      return {
        success: false,
        error: "Erro ao buscar quizzes",
      };
    }
  },

  async getStatus(id: string): Promise<ServiceResponse<any>> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID é obrigatório",
        };
      }

      const quiz = await prisma.quiz.findUnique({
        where: { id },
      });

      if (!quiz) {
        return {
          success: false,
          error: "Quiz não encontrado",
        };
      }

      return {
        success: true,
        data: quiz.status,
      };
    } catch (error) {
      console.error("Erro ao buscar quiz:", error);
      return {
        success: false,
        error: "Erro ao buscar quiz",
      };
    }
  },

    async getById(id: string): Promise<ServiceResponse<any>> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID é obrigatório",
        };
      }

      const quiz = await prisma.quiz.findUnique({
        where: { id },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      if (!quiz) {
        return {
          success: false,
          error: "Quiz não encontrado",
        };
      }

      return {
        success: true,
        data: quiz,
      };
    } catch (error) {
      console.error("Erro ao buscar quiz:", error);
      return {
        success: false,
        error: "Erro ao buscar quiz",
      };
    }
  },

  async update(id: string, formData: FormData): Promise<ServiceResponse<any>> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID é obrigatório",
        };
      }

      const title = formData.get("title")?.toString();
      const description = formData.get("description")?.toString() || null;

      if (!title || title.trim().length === 0) {
        return {
          success: false,
          error: "Título é obrigatório",
        };
      }

      const quiz = await prisma.quiz.update({
        where: { id },
        data: {
          title: title.trim(),
          description: description?.trim() || null,
        },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      return {
        success: true,
        data: quiz,
      };
    } catch (error) {
      console.error("Erro ao atualizar quiz:", error);
      return {
        success: false,
        error: "Erro ao atualizar quiz",
      };
    }
  },

  async delete(id: string): Promise<ServiceResponse<any>> {
    try {
      if (!id) {
        return {
          success: false,
          error: "ID é obrigatório",
        };
      }

      await prisma.quiz.delete({
        where: { id },
      });

      return {
        success: true,
        data: { message: "Quiz deletado com sucesso" },
      };
    } catch (error) {
      console.error("Erro ao deletar quiz:", error);
      return {
        success: false,
        error: "Erro ao deletar quiz",
      };
    }
  },
};
