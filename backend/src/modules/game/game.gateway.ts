import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';

@WebSocketGateway({ cors: true })
export class GameGateway {
  @WebSocketServer()
  private readonly server!: Server;

  constructor(private readonly gameService: GameService) {}

  @SubscribeMessage('create_game')
  async createGame(
    @MessageBody() data: { quizId: string; hostId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const game = await this.gameService.createGame(data.quizId, data.hostId);
    client.join(game.gameId);
    return game;
  }

  @SubscribeMessage('join_game')
  async joinGame(
    @MessageBody()
    data: {
      gameId: string;
      name: string;
      avatar: string;
      userId?: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const { gameId, name, avatar, userId } = data;
    const game = await this.gameService.joinGame(gameId, name, avatar, userId);
    client.join(gameId);
    this.server.to(gameId).emit('player_joined', game.players);
    return game;
  }

  @SubscribeMessage('start_game')
  async startGame(@MessageBody() data: { gameId: string; hostId: string }) {
    const question = await this.gameService.startGame(data.gameId, data.hostId);
    this.server.to(data.gameId).emit('question', question);
  }

  @SubscribeMessage('submit_answer')
  async submitAnswer(
    @MessageBody()
    data: {
      gameId: string;
      playerId: string;
      questionId: string;
      selected: string[];
    },
  ) {
    const { gameId, playerId, questionId, selected } = data;
    await this.gameService.submitAnswer(gameId, playerId, questionId, selected);
    this.server.to(gameId).emit('answer_received', { playerId });
  }

  @SubscribeMessage('next_question')
  async nextQuestion(@MessageBody() data: { gameId: string }) {
    const question = await this.gameService.nextQuestion(data.gameId);
    this.server.to(data.gameId).emit('question', question);
  }

  @SubscribeMessage('get_leaderboard')
  async getLeaderboard(@MessageBody() data: { gameId: string }) {
    const leaderboard = await this.gameService.getLeaderboard(data.gameId);
    this.server.to(data.gameId).emit('leaderboard', leaderboard);
    return leaderboard;
  }
}
