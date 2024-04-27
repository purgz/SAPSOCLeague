import { ILeaguePlayer, NewLeaguePlayer } from './league-player.model';

export const sampleWithRequiredData: ILeaguePlayer = {
  id: 65897,
  firstName: 'Garland',
  wins: 45905,
  losses: 77956,
  eloRating: 95622,
};

export const sampleWithPartialData: ILeaguePlayer = {
  id: 39599,
  firstName: 'Shanie',
  wins: 38623,
  losses: 23253,
  eloRating: 90366,
  rDishes: 25131,
};

export const sampleWithFullData: ILeaguePlayer = {
  id: 58762,
  firstName: 'Jaylen',
  lastName: 'Casper',
  wins: 99983,
  losses: 92944,
  eloRating: 88054,
  dishes: 61458,
  rDishes: 92490,
  photo: '../fake-data/blob/hipster.png',
  photoContentType: 'unknown',
};

export const sampleWithNewData: NewLeaguePlayer = {
  firstName: 'Ethan',
  wins: 16648,
  losses: 991,
  eloRating: 25012,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
