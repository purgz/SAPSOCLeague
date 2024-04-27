import dayjs from 'dayjs/esm';

import { IWeek, NewWeek } from './week.model';

export const sampleWithRequiredData: IWeek = {
  id: 76616,
  weekNum: 92019,
};

export const sampleWithPartialData: IWeek = {
  id: 602,
  weekNum: 85524,
};

export const sampleWithFullData: IWeek = {
  id: 48976,
  weekNum: 61721,
  date: dayjs('2024-04-26'),
};

export const sampleWithNewData: NewWeek = {
  weekNum: 37521,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
