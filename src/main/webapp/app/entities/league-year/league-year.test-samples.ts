import { ILeagueYear, NewLeagueYear } from './league-year.model';

export const sampleWithRequiredData: ILeagueYear = {
  id: 47133,
  yearStart: 94121,
};

export const sampleWithPartialData: ILeagueYear = {
  id: 27164,
  yearStart: 25259,
  yearEnd: 27446,
};

export const sampleWithFullData: ILeagueYear = {
  id: 14150,
  yearStart: 47847,
  yearEnd: 32801,
};

export const sampleWithNewData: NewLeagueYear = {
  yearStart: 46640,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
