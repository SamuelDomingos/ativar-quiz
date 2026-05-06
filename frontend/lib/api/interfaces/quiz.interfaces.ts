import {
  CreateQuestionDto,
  UpdateQuestionDto,
  Question,
} from "./question.interfaces"

export interface CreateQuizDto {
  title: string
  description?: string
  coverUrl?: string
  questions: CreateQuestionDto[]
}

export interface UpdateQuizDto {
  title?: string
  description?: string
  coverUrl?: string
  questions?: UpdateQuestionDto[]
}

export interface Quiz {
  id: string
  title: string
  description?: string | null
  coverUrl?: string | null
  userId: string
  questions: Question[]
  createdAt: string
  updatedAt: string
}

export interface QuizListItem {
  id: string
  title: string
  description?: string | null
  coverUrl?: string | null
  userId: string
  createdAt: string
  updatedAt: string
}
