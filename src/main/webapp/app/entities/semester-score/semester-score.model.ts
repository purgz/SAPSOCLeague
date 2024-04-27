import { ISemester } from 'app/entities/semester/semester.model';
import { ILeaguePlayer } from 'app/entities/league-player/league-player.model';

export interface ISemesterScore {
  id: number;
  score?: number | null;
  semester?: Pick<ISemester, 'id'> | null;
  player?: Pick<ILeaguePlayer, 'id'> | null;
}

export type NewSemesterScore = Omit<ISemesterScore, 'id'> & { id: null };
