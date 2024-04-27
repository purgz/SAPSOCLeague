import { IRound, NewRound } from './round.model';

export const sampleWithRequiredData: IRound = {
  id: 64257,
  roundNo: 8554,
};

export const sampleWithPartialData: IRound = {
  id: 55849,
  roundNo: 18548,
};

export const sampleWithFullData: IRound = {
  id: 28218,
  roundNo: 72060,
};

export const sampleWithNewData: NewRound = {
  roundNo: 87313,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
