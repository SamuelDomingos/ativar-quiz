export interface SubmitAnswerDto {
  questionId: string
  selected: string[]
}

export interface Answer {
  id: string
  playerId: string
  questionId: string
  selected: string[]
  isCorrect: boolean
  createdAt: string
}
