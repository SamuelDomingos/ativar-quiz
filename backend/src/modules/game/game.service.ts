import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { PrismaService } from 'src/database/prisma.service';
import { GameState } from './interfaces/game.interface';
import { Question } from '../question/interfaces/question.interface';

function generateCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

@Injectable()
export class GameService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createGame(quizId: string, hostId: string): Promise<GameState> {
    const quiz = await this.prisma.quiz.findUnique({ where: { id: quizId } });
    if (!quiz) throw new NotFoundException('Quiz não encontrado');

    let code: string;
    let attempts = 0;
    do {
      code = generateCode();
      const exists = await this.prisma.game.findUnique({ where: { code } });
      if (!exists) break;
      attempts++;
    } while (attempts < 10);

    const dbGame = await this.prisma.game.create({
      data: { code, quizId, hostId },
    });

    const gameState: GameState = {
      gameId: dbGame.id,
      code: dbGame.code,
      hostId,
      quizId,
      players: [],
      currentQuestionIndex: 0,
      started: false,
    };

    await this.redis.set(`game:${dbGame.id}`, JSON.stringify(gameState));
    return gameState;
  }

  async joinGame(
    gameId: string,
    name: string,
    avatar: string,
    userId?: string,
  ): Promise<GameState> {
    const game = await this.getGame(gameId);

    const player = await this.prisma.player.create({
      data: {
        gameId,
        userId: userId ?? null,
        name,
        avatar,
      },
    });

    game.players.push({
      playerId: player.id,
      userId: userId ?? null,
      name,
      avatar,
      score: 0,
    });

    await this.redis.set(`game:${gameId}`, JSON.stringify(game));
    return game;
  }

  async startGame(gameId: string, requesterId: string): Promise<Question> {
    const game = await this.getGame(gameId);

    if (game.hostId !== requesterId) {
      throw new ForbiddenException('Only the host can start the game');
    }

    const quiz = await this.prisma.quiz.findUnique({
      where: { id: game.quizId },
      include: { questions: { include: { options: true } } },
    });

    if (!quiz) throw new NotFoundException('Quiz not found');

    game.started = true;
    game.questions = quiz.questions as unknown as Question[];

    await this.redis.set(`game:${gameId}`, JSON.stringify(game));
    return game.questions[0];
  }

  async nextQuestion(gameId: string): Promise<Question> {
    const game = await this.getGame(gameId);

    if (!game.questions || game.questions.length === 0) {
      throw new Error('Game has no questions – start the game first');
    }

    game.currentQuestionIndex++;

    if (game.currentQuestionIndex >= game.questions.length) {
      throw new NotFoundException('No more questions available');
    }

    await this.redis.set(`game:${gameId}`, JSON.stringify(game));
    return game.questions[game.currentQuestionIndex];
  }

  async submitAnswer(
    gameId: string,
    playerId: string,
    questionId: string,
    selected: string[],
  ): Promise<void> {
    const game = await this.getGame(gameId);

    if (!game.answers) game.answers = {};
    game.answers[playerId] = selected;

    // Verifica se a resposta está correta
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
      include: { options: true },
    });

    let isCorrect = false;
    if (question) {
      const correctIds = question.options
        .filter((o) => o.isCorrect)
        .map((o) => o.id);
      isCorrect =
        selected.length === correctIds.length &&
        selected.every((id) => correctIds.includes(id));
    }

    // Persiste a resposta no banco
    await this.prisma.answer.create({
      data: { playerId, questionId, selected, isCorrect },
    });

    // Atualiza score do player se correto
    if (isCorrect) {
      const player = game.players.find((p) => p.playerId === playerId);
      if (player) {
        player.score += 100;
        await this.prisma.player.update({
          where: { id: playerId },
          data: { score: player.score },
        });
      }
    }

    await this.redis.set(`game:${gameId}`, JSON.stringify(game));
  }

  async getGame(gameId: string): Promise<GameState> {
    const data = await this.redis.get(`game:${gameId}`);
    if (!data) throw new NotFoundException('Game data not found');
    return JSON.parse(data) as GameState;
  }

  async getGameByCode(code: string): Promise<GameState> {
    const dbGame = await this.prisma.game.findUnique({ where: { code } });
    if (!dbGame) throw new NotFoundException('Game not found');
    return this.getGame(dbGame.id);
  }

  async getLeaderboard(gameId: string) {
    return this.prisma.player.findMany({
      where: { gameId },
      orderBy: { score: 'desc' },
      select: { id: true, name: true, avatar: true, score: true },
    });
  }
}
