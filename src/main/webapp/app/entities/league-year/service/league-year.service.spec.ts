import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILeagueYear } from '../league-year.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../league-year.test-samples';

import { LeagueYearService } from './league-year.service';

const requireRestSample: ILeagueYear = {
  ...sampleWithRequiredData,
};

describe('LeagueYear Service', () => {
  let service: LeagueYearService;
  let httpMock: HttpTestingController;
  let expectedResult: ILeagueYear | ILeagueYear[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LeagueYearService);
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

    it('should create a LeagueYear', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const leagueYear = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(leagueYear).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LeagueYear', () => {
      const leagueYear = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(leagueYear).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LeagueYear', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LeagueYear', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LeagueYear', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLeagueYearToCollectionIfMissing', () => {
      it('should add a LeagueYear to an empty array', () => {
        const leagueYear: ILeagueYear = sampleWithRequiredData;
        expectedResult = service.addLeagueYearToCollectionIfMissing([], leagueYear);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leagueYear);
      });

      it('should not add a LeagueYear to an array that contains it', () => {
        const leagueYear: ILeagueYear = sampleWithRequiredData;
        const leagueYearCollection: ILeagueYear[] = [
          {
            ...leagueYear,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLeagueYearToCollectionIfMissing(leagueYearCollection, leagueYear);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LeagueYear to an array that doesn't contain it", () => {
        const leagueYear: ILeagueYear = sampleWithRequiredData;
        const leagueYearCollection: ILeagueYear[] = [sampleWithPartialData];
        expectedResult = service.addLeagueYearToCollectionIfMissing(leagueYearCollection, leagueYear);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leagueYear);
      });

      it('should add only unique LeagueYear to an array', () => {
        const leagueYearArray: ILeagueYear[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const leagueYearCollection: ILeagueYear[] = [sampleWithRequiredData];
        expectedResult = service.addLeagueYearToCollectionIfMissing(leagueYearCollection, ...leagueYearArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const leagueYear: ILeagueYear = sampleWithRequiredData;
        const leagueYear2: ILeagueYear = sampleWithPartialData;
        expectedResult = service.addLeagueYearToCollectionIfMissing([], leagueYear, leagueYear2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leagueYear);
        expect(expectedResult).toContain(leagueYear2);
      });

      it('should accept null and undefined values', () => {
        const leagueYear: ILeagueYear = sampleWithRequiredData;
        expectedResult = service.addLeagueYearToCollectionIfMissing([], null, leagueYear, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leagueYear);
      });

      it('should return initial array if no LeagueYear is added', () => {
        const leagueYearCollection: ILeagueYear[] = [sampleWithRequiredData];
        expectedResult = service.addLeagueYearToCollectionIfMissing(leagueYearCollection, undefined, null);
        expect(expectedResult).toEqual(leagueYearCollection);
      });
    });

    describe('compareLeagueYear', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLeagueYear(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLeagueYear(entity1, entity2);
        const compareResult2 = service.compareLeagueYear(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLeagueYear(entity1, entity2);
        const compareResult2 = service.compareLeagueYear(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLeagueYear(entity1, entity2);
        const compareResult2 = service.compareLeagueYear(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
