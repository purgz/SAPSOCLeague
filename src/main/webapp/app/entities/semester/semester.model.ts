import { ILeagueYear } from 'app/entities/league-year/league-year.model';

export interface ISemester {
  id: number;
  semesterNum?: number | null;
  year?: Pick<ILeagueYear, 'id'> | null;
}

export type NewSemester = Omit<ISemester, 'id'> & { id: null };
