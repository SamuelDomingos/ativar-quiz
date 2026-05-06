import { Question } from 'src/modules/question/interfaces/question.interface';

export interface Quiz {
  id: string;
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  userId: string;
  questions: Question[];
  createdAt?: Date;
  updatedAt?: Date;
}
