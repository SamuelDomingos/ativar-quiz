import { Quiz } from "../generated/prisma/client";

interface QuizCreateInput {
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

export const createQuiz = async (data: QuizCreateInput): Promise<Quiz> => {
  const response = await fetch("/api/quiz", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Erro ao criar GC");
  }

  return response.json();
};

export const getAllQuizzes = async (): Promise<Quiz[]> => {
  const response = await fetch(`/api/quiz`, {
    method: "GET",
  });
  return response.json();
};

export const getQuizById = async (id: string): Promise<Quiz> => {
  const response = await fetch(`/api/quiz/${id}`, {
    method: "GET",
  });
  return response.json();
};

export const deleteRegister = async (id: string) => {
  const response = await fetch(`/api/quiz?id=${id}`, {
    method: "DELETE",
  });
  return response.json();
};
