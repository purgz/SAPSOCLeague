import { ILeaguePlayer, NewLeaguePlayer } from './league-player.model';

export const sampleWithRequiredData: ILeaguePlayer = {
  id: 65897,
  firstName: 'Garland',
  wins: 45905,
  losses: 77956,
  eloRating: 95622,
};

export const sampleWithPartialData: ILeaguePlayer = {
  id: 33603,
  firstName: 'Gonzalo',
  wins: 88067,
  losses: 38623,
  eloRating: 23253,
  rDishes: 90366,
};

export const sampleWithFullData: ILeaguePlayer = {
  id: 25131,
  firstName: 'Kyra',
  lastName: 'Kub',
  wins: 12418,
  losses: 99983,
  eloRating: 92944,
  dishes: 88054,
  rDishes: 61458,
};

export const sampleWithNewData: NewLeaguePlayer = {
  firstName: 'Tia',
  wins: 33581,
  losses: 16648,
  eloRating: 991,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
