import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import type { IAnswerRepository } from './repositories/answer.repository';
import type { IQuestionRepository } from '../question/repositories/question.repository';

@Injectable()
export class AnswerService {
  constructor(
    @Inject('IAnswerRepository') private readonly repository: IAnswerRepository,
    @Inject('IQuestionRepository')
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async submit(dto: SubmitAnswerDto) {
    const question = await this.questionRepository.findOne(dto.questionId);

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return this.repository.create({
      userId: dto.userId,
      questionId: dto.questionId,
      selected: dto.selected,
    });
  }

  async getByQuestion(questionId: string) {
    return this.repository.findByQuestion(questionId);
  }
}
