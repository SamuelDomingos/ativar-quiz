import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaQuestionRepository } from './repositories/prisma-question.repository';
import { QuizModule } from '../quiz/quiz.module';
import { PrismaModule } from 'src/database/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [QuizModule, PrismaModule, StorageModule],
  controllers: [QuestionController],
  providers: [
    QuestionService,
    {
      provide: 'IQuestionRepository',
      useClass: PrismaQuestionRepository,
    },
  ],
  exports: ['IQuestionRepository'],
})
export class QuestionModule {}
