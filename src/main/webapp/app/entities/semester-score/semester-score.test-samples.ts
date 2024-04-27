import { ISemesterScore, NewSemesterScore } from './semester-score.model';

export const sampleWithRequiredData: ISemesterScore = {
  id: 79853,
};

export const sampleWithPartialData: ISemesterScore = {
  id: 84669,
};

export const sampleWithFullData: ISemesterScore = {
  id: 93366,
  score: 99902,
};

export const sampleWithNewData: NewSemesterScore = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
