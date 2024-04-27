export interface ILeagueYear {
  id: number;
  yearStart?: number | null;
  yearEnd?: number | null;
}

export type NewLeagueYear = Omit<ILeagueYear, 'id'> & { id: null };
