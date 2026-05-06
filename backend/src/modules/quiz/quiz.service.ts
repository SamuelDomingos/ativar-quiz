import { Injectable, Inject } from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import type { IQuizRepository } from './repositories/quiz.repository';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { StorageService } from '../storage/storage.service';
import { UploadedFile } from '../storage/storage.interface';

@Injectable()
export class QuizService {
  constructor(
    @Inject('IQuizRepository') private readonly repository: IQuizRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(userId: string, data: CreateQuizDto) {
    return this.repository.create(userId, data);
  }

  async update(id: string, data: UpdateQuizDto) {
    return this.repository.update(id, data);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findByUser(userId: string) {
    return this.repository.findByUser(userId);
  }

  async findOne(id: string) {
    return this.repository.findOne(id);
  }

  async remove(id: string): Promise<any> {
    return this.repository.remove(id);
  }

  async uploadCover(quizId: string, file: UploadedFile) {
    const result = await this.storageService.upload(file, 'quiz-covers');
    await this.repository.updateCover(quizId, result.url);
    return result;
  }
}
