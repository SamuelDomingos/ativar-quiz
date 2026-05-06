import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';

@ApiTags('Game')
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('code/:code')
  @ApiOperation({ summary: 'Buscar estado de um game pelo código de sala' })
  @ApiParam({ name: 'code', description: 'Código de 6 caracteres do game' })
  getByCode(@Param('code') code: string) {
    return this.gameService.getGameByCode(code);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar estado de um game pelo ID' })
  @ApiParam({ name: 'id' })
  getGame(@Param('id') id: string) {
    return this.gameService.getGame(id);
  }

  @Get(':id/leaderboard')
  @ApiOperation({ summary: 'Ranking dos jogadores de um game' })
  @ApiParam({ name: 'id' })
  getLeaderboard(@Param('id') id: string) {
    return this.gameService.getLeaderboard(id);
  }
}
