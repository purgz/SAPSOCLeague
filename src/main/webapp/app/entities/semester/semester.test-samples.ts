import { ISemester, NewSemester } from './semester.model';

export const sampleWithRequiredData: ISemester = {
  id: 45912,
  semesterNum: 75035,
};

export const sampleWithPartialData: ISemester = {
  id: 24862,
  semesterNum: 3870,
};

export const sampleWithFullData: ISemester = {
  id: 34688,
  semesterNum: 18615,
};

export const sampleWithNewData: NewSemester = {
  semesterNum: 65555,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
