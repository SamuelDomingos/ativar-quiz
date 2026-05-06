import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { QuizModule } from './modules/quiz/quiz.module';
import { UserModule } from './modules/user/user.module';
import { AnswerModule } from './modules/answer/answer.module';
import { QuestionModule } from './modules/question/question.module';
import { GameModule } from './modules/game/game.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './database/prisma.module';
import { AppRedisModule } from './redis/redis.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    PrismaModule,
    AppRedisModule,
    StorageModule,
    QuizModule,
    GameModule,
    QuestionModule,
    AnswerModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
