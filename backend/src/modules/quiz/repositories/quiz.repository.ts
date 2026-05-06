import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';
import { Quiz } from '../interfaces/quiz.interface';

export interface IQuizRepository {
  create(data: CreateQuizDto): Promise<Quiz>;
  update(id: string, data: UpdateQuizDto): Promise<Quiz>;
  findAll(): Promise<Quiz[]>;
  findOne(id: string): Promise<Quiz>;
  remove(id: string): Promise<any>;
}
