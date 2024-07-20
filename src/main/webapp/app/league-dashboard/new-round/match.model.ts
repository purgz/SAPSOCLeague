import { ILeaguePlayer } from '../../entities/league-player/league-player.model';

export interface MatchModel {
  player1: ILeaguePlayer;
  player2: ILeaguePlayer;
  gameEnding: String;
  p1Score: number;
  p2Score: number;
}
