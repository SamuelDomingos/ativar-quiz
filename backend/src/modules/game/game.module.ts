import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { PrismaModule } from 'src/database/prisma.module';
import { AppRedisModule } from 'src/redis/redis.module';

@Module({
  imports: [PrismaModule, AppRedisModule],
  providers: [GameGateway, GameService],
  exports: [GameService],
})
export class GameModule {}
