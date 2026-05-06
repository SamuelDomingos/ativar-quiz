import { BadRequestException } from '@nestjs/common';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { Question } from 'src/modules/question/interfaces/question.interface';

export class AnswerEntity {
  static validateAndCalculateCorrectness(
    dto: SubmitAnswerDto,
    question: Question,
  ) {
    const correctOptions = question.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id);

    const validOptionIds = question.options.map((o) => o.id);

    for (const selected of dto.selected) {
      if (!validOptionIds.includes(selected)) {
        throw new BadRequestException('Invalid option selected');
      }
    }

    const isCorrect =
      correctOptions.length === dto.selected.length &&
      correctOptions.every((id: string) => dto.selected.includes(id));

    return isCorrect;
  }
}
