import { ILeaguePlayer } from 'app/entities/league-player/league-player.model';
import { IRound } from 'app/entities/round/round.model';
import { GameEnding } from 'app/entities/enumerations/game-ending.model';

export interface IGameResult {
  id: number;
  gameEnding?: GameEnding | null;
  p1Score?: number | null;
  p2Score?: number | null;
  player1?: ILeaguePlayer | null;
  player2?: ILeaguePlayer | null;
  round?: Pick<IRound, 'id'> | null;
}

export type NewGameResult = Omit<IGameResult, 'id'> & { id: null };
