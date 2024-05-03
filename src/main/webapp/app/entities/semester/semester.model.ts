import { ILeagueYear } from 'app/entities/league-year/league-year.model';
import { ILeaguePlayer } from 'app/entities/league-player/league-player.model';

export interface ISemester {
  id: number;
  semesterNum?: number | null;
  year?: Pick<ILeagueYear, 'id'> | null;
  players?: Pick<ILeaguePlayer, 'id'>[] | null;
}

export type NewSemester = Omit<ISemester, 'id'> & { id: null };
