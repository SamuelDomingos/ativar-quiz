import { Question } from "./question.interfaces"

export interface PlayerState {
  playerId: string
  userId: string | null
  name: string
  avatar: string
  score: number
}

export interface GameState {
  gameId: string
  code: string
  quizId: string
  hostId: string
  players: PlayerState[]
  currentQuestionIndex: number
  started: boolean
  questions?: Question[]
  answers?: Record<string, string[]>
}

export interface CreateGameDto {
  quizId: string
  hostId: string
}

export interface JoinGameDto {
  gameId: string
  name: string
  avatar: string
  userId?: string
}

export interface JoinGameByCodeDto {
  code: string
  name: string
  avatar: string
  userId?: string
}

export interface LeaderboardEntry {
  id: string
  name: string
  avatar: string
  score: number
}
