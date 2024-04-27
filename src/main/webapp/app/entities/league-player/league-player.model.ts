export interface ILeaguePlayer {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  wins?: number | null;
  losses?: number | null;
  eloRating?: number | null;
  dishes?: number | null;
  rDishes?: number | null;
}

export type NewLeaguePlayer = Omit<ILeaguePlayer, 'id'> & { id: null };
