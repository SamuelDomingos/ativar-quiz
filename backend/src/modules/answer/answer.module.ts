import { Module } from '@nestjs/common';
import { AnswerService } from './answer.service';
import { AnswerController } from './answer.controller';
import { PrismaAnswerRepository } from './repositories/prisma-answer.repository';
import { QuestionModule } from '../question/question.module';
import { PrismaModule } from 'src/database/prisma.module';

@Module({
  imports: [QuestionModule, PrismaModule],
  controllers: [AnswerController],
  providers: [
    AnswerService,
    {
      provide: 'IAnswerRepository',
      useClass: PrismaAnswerRepository,
    },
  ],
})
export class AnswerModule {}
