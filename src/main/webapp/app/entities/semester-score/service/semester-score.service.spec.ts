import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISemesterScore } from '../semester-score.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../semester-score.test-samples';

import { SemesterScoreService } from './semester-score.service';

const requireRestSample: ISemesterScore = {
  ...sampleWithRequiredData,
};

describe('SemesterScore Service', () => {
  let service: SemesterScoreService;
  let httpMock: HttpTestingController;
  let expectedResult: ISemesterScore | ISemesterScore[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SemesterScoreService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a SemesterScore', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const semesterScore = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(semesterScore).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SemesterScore', () => {
      const semesterScore = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(semesterScore).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SemesterScore', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SemesterScore', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SemesterScore', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSemesterScoreToCollectionIfMissing', () => {
      it('should add a SemesterScore to an empty array', () => {
        const semesterScore: ISemesterScore = sampleWithRequiredData;
        expectedResult = service.addSemesterScoreToCollectionIfMissing([], semesterScore);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(semesterScore);
      });

      it('should not add a SemesterScore to an array that contains it', () => {
        const semesterScore: ISemesterScore = sampleWithRequiredData;
        const semesterScoreCollection: ISemesterScore[] = [
          {
            ...semesterScore,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSemesterScoreToCollectionIfMissing(semesterScoreCollection, semesterScore);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SemesterScore to an array that doesn't contain it", () => {
        const semesterScore: ISemesterScore = sampleWithRequiredData;
        const semesterScoreCollection: ISemesterScore[] = [sampleWithPartialData];
        expectedResult = service.addSemesterScoreToCollectionIfMissing(semesterScoreCollection, semesterScore);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(semesterScore);
      });

      it('should add only unique SemesterScore to an array', () => {
        const semesterScoreArray: ISemesterScore[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const semesterScoreCollection: ISemesterScore[] = [sampleWithRequiredData];
        expectedResult = service.addSemesterScoreToCollectionIfMissing(semesterScoreCollection, ...semesterScoreArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const semesterScore: ISemesterScore = sampleWithRequiredData;
        const semesterScore2: ISemesterScore = sampleWithPartialData;
        expectedResult = service.addSemesterScoreToCollectionIfMissing([], semesterScore, semesterScore2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(semesterScore);
        expect(expectedResult).toContain(semesterScore2);
      });

      it('should accept null and undefined values', () => {
        const semesterScore: ISemesterScore = sampleWithRequiredData;
        expectedResult = service.addSemesterScoreToCollectionIfMissing([], null, semesterScore, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(semesterScore);
      });

      it('should return initial array if no SemesterScore is added', () => {
        const semesterScoreCollection: ISemesterScore[] = [sampleWithRequiredData];
        expectedResult = service.addSemesterScoreToCollectionIfMissing(semesterScoreCollection, undefined, null);
        expect(expectedResult).toEqual(semesterScoreCollection);
      });
    });

    describe('compareSemesterScore', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSemesterScore(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSemesterScore(entity1, entity2);
        const compareResult2 = service.compareSemesterScore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSemesterScore(entity1, entity2);
        const compareResult2 = service.compareSemesterScore(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSemesterScore(entity1, entity2);
        const compareResult2 = service.compareSemesterScore(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
