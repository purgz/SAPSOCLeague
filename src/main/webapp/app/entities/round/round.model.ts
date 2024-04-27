import { IWeek } from 'app/entities/week/week.model';

export interface IRound {
  id: number;
  roundNo?: number | null;
  week?: Pick<IWeek, 'id'> | null;
}

export type NewRound = Omit<IRound, 'id'> & { id: null };
