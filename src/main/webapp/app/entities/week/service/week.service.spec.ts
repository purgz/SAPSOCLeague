import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IWeek } from '../week.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../week.test-samples';

import { WeekService, RestWeek } from './week.service';

const requireRestSample: RestWeek = {
  ...sampleWithRequiredData,
  date: sampleWithRequiredData.date?.format(DATE_FORMAT),
};

describe('Week Service', () => {
  let service: WeekService;
  let httpMock: HttpTestingController;
  let expectedResult: IWeek | IWeek[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(WeekService);
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

    it('should create a Week', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const week = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(week).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Week', () => {
      const week = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(week).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Week', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Week', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Week', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addWeekToCollectionIfMissing', () => {
      it('should add a Week to an empty array', () => {
        const week: IWeek = sampleWithRequiredData;
        expectedResult = service.addWeekToCollectionIfMissing([], week);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(week);
      });

      it('should not add a Week to an array that contains it', () => {
        const week: IWeek = sampleWithRequiredData;
        const weekCollection: IWeek[] = [
          {
            ...week,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addWeekToCollectionIfMissing(weekCollection, week);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Week to an array that doesn't contain it", () => {
        const week: IWeek = sampleWithRequiredData;
        const weekCollection: IWeek[] = [sampleWithPartialData];
        expectedResult = service.addWeekToCollectionIfMissing(weekCollection, week);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(week);
      });

      it('should add only unique Week to an array', () => {
        const weekArray: IWeek[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const weekCollection: IWeek[] = [sampleWithRequiredData];
        expectedResult = service.addWeekToCollectionIfMissing(weekCollection, ...weekArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const week: IWeek = sampleWithRequiredData;
        const week2: IWeek = sampleWithPartialData;
        expectedResult = service.addWeekToCollectionIfMissing([], week, week2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(week);
        expect(expectedResult).toContain(week2);
      });

      it('should accept null and undefined values', () => {
        const week: IWeek = sampleWithRequiredData;
        expectedResult = service.addWeekToCollectionIfMissing([], null, week, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(week);
      });

      it('should return initial array if no Week is added', () => {
        const weekCollection: IWeek[] = [sampleWithRequiredData];
        expectedResult = service.addWeekToCollectionIfMissing(weekCollection, undefined, null);
        expect(expectedResult).toEqual(weekCollection);
      });
    });

    describe('compareWeek', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareWeek(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareWeek(entity1, entity2);
        const compareResult2 = service.compareWeek(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareWeek(entity1, entity2);
        const compareResult2 = service.compareWeek(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareWeek(entity1, entity2);
        const compareResult2 = service.compareWeek(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
