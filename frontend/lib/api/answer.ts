import { Answer, SubmitAnswerDto } from "./interfaces/answer.interfaces"

export const submitAnswer = async (
  quizId: string,
  payload: SubmitAnswerDto
): Promise<Answer> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz/${quizId}/answers`,
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
    throw new Error(err?.error ?? "Erro ao enviar resposta")
  }

  return response.json()
}

export const getAnswersByQuiz = async (quizId: string): Promise<Answer[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz/${quizId}/answers`
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao buscar respostas")
  }

  return response.json()
}

export const getAnswer = async (
  quizId: string,
  answerId: string
): Promise<Answer> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz/${quizId}/answers/${answerId}`
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Resposta não encontrada")
  }

  return response.json()
}
