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

export const getQuizStatus = async (
  id: string,
): Promise<{ data: string }> => {
  const response = await fetch(`/api/quiz/${id}/status`, {
    method: "GET",
  });
  return response.json();
};

export const getQuestionMonitoringData = async (
  quizId: string,
  questionId: string,
) => {
  try {
    const response = await fetch(
      `/api/quiz/${quizId}/questions/${questionId}/monitor`,
      {
        method: "GET",
      },
    );
    const data = await response.json();

    return data.data;
  } catch (error) {
    console.error("Erro ao buscar monitoramento:", error);
    return null;
  }
};

export const deleteRegister = async (id: string) => {
  const response = await fetch(`/api/quiz?id=${id}`, {
    method: "DELETE",
  });
  return response.json();
};
