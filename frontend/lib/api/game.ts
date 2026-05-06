import { GameState } from "./interfaces/game.interfaces"
import { Question } from "./interfaces/question.interfaces"

export async function createGame(
  quizId: string,
  token: string
): Promise<{ gameId: string; hostId: string; joinUrl: string }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ quizId }),
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error ?? "Erro ao enviar resposta")
  }

  return res.json()
}

export async function joinGame(
  gameId: string,
  userId?: string
): Promise<GameState> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}/join`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error ?? "Erro ao enviar resposta")
  }

  return res.json()
}

export async function startGame(
  gameId: string,
  token: string
): Promise<Question> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}/start`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error ?? "Erro ao enviar resposta")
  }

  return res.json()
}

export async function getGame(gameId: string): Promise<GameState> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}`)

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error ?? "Erro ao enviar resposta")
  }

  return res.json()
}

export async function nextQuestion(gameId: string): Promise<Question> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/games/${gameId}/next`,
    {
      method: "POST",
    }
  )

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err?.error ?? "Erro ao enviar resposta")
  }

  return res.json()
}
