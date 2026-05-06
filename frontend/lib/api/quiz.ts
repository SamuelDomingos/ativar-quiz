import { CreateQuizDto, Quiz } from "./interfaces/quiz.interfaces"

export const getQuizzes = async (page = 1, limit = 10): Promise<Quiz[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz?page=${page}&limit=${limit}`
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao buscar quizzes")
  }

  return response.json()
}

export const getQuiz = async (id: string): Promise<Quiz> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz/${id}`)

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Quiz não encontrado")
  }

  return response.json()
}

export const createQuiz = async (payload: CreateQuizDto): Promise<Quiz> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/quiz`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao criar quiz")
  }

  return response.json()
}

export const updateQuiz = async (
  id: string,
  payload: Partial<CreateQuizDto>
): Promise<Quiz> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao atualizar quiz")
  }

  return response.json()
}

export const deleteQuiz = async (id: string): Promise<void> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/quiz/${id}`,
    {
      method: "DELETE",
    }
  )

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error ?? "Erro ao remover quiz")
  }
}
