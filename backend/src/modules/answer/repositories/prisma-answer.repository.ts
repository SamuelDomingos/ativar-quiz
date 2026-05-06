import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IAnswerRepository } from './answer.repository';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';

@Injectable()
export class PrismaAnswerRepository implements IAnswerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: SubmitAnswerDto) {
    return this.prisma.answer.create({
      data,
    });
  }

  async findByQuestion(questionId: string) {
    return this.prisma.answer.findMany({
      where: { questionId },
    });
  }
}
