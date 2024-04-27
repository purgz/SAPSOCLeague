import { ISemester } from 'app/entities/semester/semester.model';

export interface ILeaguePlayer {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  wins?: number | null;
  losses?: number | null;
  eloRating?: number | null;
  dishes?: number | null;
  rDishes?: number | null;
  photo?: string | null;
  photoContentType?: string | null;
  semester?: Pick<ISemester, 'id'> | null;
}

export type NewLeaguePlayer = Omit<ILeaguePlayer, 'id'> & { id: null };
