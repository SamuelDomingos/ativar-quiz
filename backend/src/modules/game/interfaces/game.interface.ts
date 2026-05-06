import { Question } from 'src/modules/question/interfaces/question.interface';

export interface PlayerState {
  playerId: string;
  userId: string | null;
  name: string;
  avatar: string;
  score: number;
}

export interface GameState {
  gameId: string;
  code: string;
  hostId: string;
  quizId: string;
  players: PlayerState[];
  currentQuestionIndex: number;
  started: boolean;
  questions?: Question[];
  answers?: Record<string, string[]>;
}
