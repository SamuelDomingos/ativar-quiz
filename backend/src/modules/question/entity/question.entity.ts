import { BadRequestException } from '@nestjs/common';
import { CreateQuestionDto, QuestionType } from '../dto/create-question.dto';

export class QuestionEntity {
  static validate(dto: CreateQuestionDto) {
    const correctCount = dto.options.filter((o) => o.isCorrect).length;

    if (dto.type === QuestionType.SINGLE && correctCount !== 1) {
      throw new BadRequestException(
        'SINGLE question must have exactly one correct option',
      );
    }

    if (dto.type === QuestionType.MULTIPLE && correctCount < 1) {
      throw new BadRequestException(
        'MULTIPLE question must have at least one correct option',
      );
    }
  }
}
