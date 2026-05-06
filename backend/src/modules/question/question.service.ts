import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import type { IQuestionRepository } from './repositories/question.repository';
import type { IQuizRepository } from '../quiz/repositories/quiz.repository';
import { QuestionEntity } from './entity/question.entity';
import { StorageService } from '../storage/storage.service';
import { UploadedFile } from '../storage/storage.interface';

@Injectable()
export class QuestionService {
  constructor(
    @Inject('IQuestionRepository')
    private readonly repository: IQuestionRepository,
    @Inject('IQuizRepository') private readonly quizRepository: IQuizRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(quizId: string, dto: CreateQuestionDto) {
    const quiz = await this.quizRepository.findOne(quizId);
    if (!quiz) throw new NotFoundException('Quiz not found');
    QuestionEntity.validate(dto);
    return this.repository.create(quizId, dto);
  }

  async findByQuiz(quizId: string) {
    return this.repository.findByQuiz(quizId);
  }

  async remove(id: string) {
    return this.repository.remove(id);
  }

  async uploadImage(questionId: string, file: UploadedFile) {
    const result = await this.storageService.upload(file, 'question-images');
    await this.repository.updateImage(questionId, result.url);
    return result;
  }
}
