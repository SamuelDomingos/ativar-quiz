import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IQuestionRepository } from './question.repository';
import { CreateQuestionDto } from '../dto/create-question.dto';

@Injectable()
export class PrismaQuestionRepository implements IQuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(quizId: string, dto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        text: dto.text,
        type: dto.type,
        imageUrl: dto.imageUrl,
        quizId,
        options: {
          create: dto.options,
        },
      },
      include: {
        options: true,
      },
    });
  }

  async findByQuiz(quizId: string) {
    return this.prisma.question.findMany({
      where: { quizId },
      include: { options: true },
    });
  }

  async findOne(id: string) {
    return this.prisma.question.findUnique({
      where: { id },
      include: { options: true },
    });
  }

  async remove(id: string) {
    return this.prisma.question.delete({ where: { id } });
  }

  async updateImage(id: string, imageUrl: string) {
    return this.prisma.question.update({
      where: { id },
      data: { imageUrl },
    });
  }
}
