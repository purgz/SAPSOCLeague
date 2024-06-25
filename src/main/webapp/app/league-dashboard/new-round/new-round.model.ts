import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';
import { IRound } from '../../entities/round/round.model';
import { IGameResult } from '../../entities/game-result/game-result.model';
import { IWeek } from '../../entities/week/week.model';

export interface NewRoundModel {
  //need to create the new round model and populate it.
  week: IWeek;

  //add or remove players to the current week.
  //use for RR generation
  weekPlayers: Array<ILeaguePlayer>;

  rounds: {
    [roundNum: number]: {
      matches: Array<IGameResult>;
    };
  };
}
