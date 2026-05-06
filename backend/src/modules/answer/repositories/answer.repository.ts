import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { answer } from '../interfaces/answer.interface';

export interface IAnswerRepository {
  create(data: SubmitAnswerDto): Promise<answer>;
  findByQuestion(questionId: string): Promise<answer[]>;
}
