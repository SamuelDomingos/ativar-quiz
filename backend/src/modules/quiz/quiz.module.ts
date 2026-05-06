import { Module } from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizController } from './quiz.controller';
import { PrismaQuizRepository } from './repositories/prisma-quiz.repository';
import { PrismaModule } from 'src/database/prisma.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [PrismaModule, StorageModule],
  controllers: [QuizController],
  providers: [
    QuizService,
    {
      provide: 'IQuizRepository',
      useClass: PrismaQuizRepository,
    },
  ],
  exports: ['IQuizRepository', QuizService],
})
export class QuizModule {}
