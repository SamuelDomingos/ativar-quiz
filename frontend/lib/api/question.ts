import { CreateQuestionDto, Question } from "./interfaces/question.interfaces"

export const getQuestions = async (quizId: string): Promise<Question[]> => {
  const response = await fetch(
    `$${process.env.NEXT_PUBLIC_API_URL}/quiz/${quizId}/questions`
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao buscar perguntas")
  }
  return response.json()
}

export const createQuestion = async (
  quizId: string,
  payload: CreateQuestionDto
): Promise<Question> => {
  const response = await fetch(
    `$${process.env.NEXT_PUBLIC_API_URL}/quiz/${quizId}/questions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao criar pergunta")
  }
  return response.json()
}

export const deleteQuestion = async (
  quizId: string,
  questionId: string
): Promise<void> => {
  const response = await fetch(
    `$${process.env.NEXT_PUBLIC_API_URL}/quiz/${quizId}/questions/${questionId}`,
    { method: "DELETE" }
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao remover pergunta")
  }
}
