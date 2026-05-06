export type QuestionType = "SINGLE" | "MULTIPLE"

export interface CreateOptionDto {
  text: string
  isCorrect: boolean
}

export interface UpdateOptionDto extends CreateOptionDto {
  id: string
}

export interface Option extends UpdateOptionDto {
  questionId: string
  createdAt: string
}

export interface CreateQuestionDto {
  text: string
  type: QuestionType
  imageUrl?: string
  options: CreateOptionDto[]
}

export interface UpdateQuestionDto extends CreateQuestionDto {
  id: string
}

export interface Question {
  id: string
  text: string
  type: QuestionType
  imageUrl?: string | null
  options: Option[]
  quizId: string
  createdAt: string
  updatedAt: string
}
