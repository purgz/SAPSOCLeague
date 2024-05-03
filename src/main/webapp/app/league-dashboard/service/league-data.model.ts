import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';

export interface LeagueDataModel {
  year: ILeagueYear;
  semesters: Array<ISemester>;

  players: {
    [playerId: number]: {
      player: ILeaguePlayer;
      score: Array<ISemesterScore>;
    };
  };
}
