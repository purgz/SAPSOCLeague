import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';
import { MatchModel } from './match.model';

export interface NewWeekModel {
  rounds: {
    [roundNo: number]: {
      matches: { [matchNo: number]: MatchModel };
      bye: ILeaguePlayer | null;
    };
  };
}
