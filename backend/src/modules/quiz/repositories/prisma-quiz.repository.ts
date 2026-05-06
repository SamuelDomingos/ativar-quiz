import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { IQuizRepository } from './quiz.repository';
import { CreateQuizDto } from '../dto/create-quiz.dto';
import { UpdateQuizDto } from '../dto/update-quiz.dto';

@Injectable()
export class PrismaQuizRepository implements IQuizRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, data: CreateQuizDto) {
    return this.prisma.quiz.create({
      data: {
        title: data.title,
        description: data.description,
        coverUrl: data.coverUrl,
        userId,
        questions: {
          create: data.questions.map((q) => ({
            text: q.text,
            type: q.type,
            imageUrl: q.imageUrl,
            options: {
              create: q.options.map((o) => ({
                text: o.text,
                isCorrect: o.isCorrect,
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async update(id: string, data: UpdateQuizDto) {
    return this.prisma.quiz.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        coverUrl: data.coverUrl,
        questions: data.questions
          ? {
              update: data.questions.map((q) => ({
                where: { id: q.id },
                data: {
                  text: q.text,
                  type: q.type,
                  imageUrl: q.imageUrl,
                  options: q.options
                    ? {
                        update: q.options.map((o) => ({
                          where: { id: o.id },
                          data: {
                            text: o.text,
                            isCorrect: o.isCorrect,
                          },
                        })),
                      }
                    : undefined,
                },
              })),
            }
          : undefined,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async findAll() {
    return this.prisma.quiz.findMany({
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.quiz.findMany({
      where: { userId },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const quiz = await this.prisma.quiz.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    });
    if (!quiz) {
      throw new NotFoundException('Quiz não encontrado');
    }
    return quiz;
  }

  async remove(id: string) {
    return this.prisma.quiz.delete({
      where: { id },
    });
  }

  async updateCover(id: string, coverUrl: string) {
    return this.prisma.quiz.update({
      where: { id },
      data: { coverUrl },
    });
  }
}
