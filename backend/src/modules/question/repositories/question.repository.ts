import { CreateQuestionDto } from '../dto/create-question.dto';
import { Question } from '../interfaces/question.interface';

export interface IQuestionRepository {
  create(quizId: string, data: CreateQuestionDto): Promise<Question>;
  findByQuiz(quizId: string): Promise<Question[]>;
  findOne(id: string): Promise<Question | null>;
  remove(id: string);
}
