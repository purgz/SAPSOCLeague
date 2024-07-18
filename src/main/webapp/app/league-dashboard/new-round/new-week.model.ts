import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';

export interface NewWeekModel {
  rounds: {
    [roundNo: number]: {
      [matchNo: number]: {
        player1: ILeaguePlayer;
        player2: ILeaguePlayer;
        gameEnding: String;
        p1Score: number;
        p2Score: number;
      };
    };
  };
}
