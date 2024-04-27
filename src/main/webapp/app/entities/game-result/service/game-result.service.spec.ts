import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IGameResult } from '../game-result.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../game-result.test-samples';

import { GameResultService } from './game-result.service';

const requireRestSample: IGameResult = {
  ...sampleWithRequiredData,
};

describe('GameResult Service', () => {
  let service: GameResultService;
  let httpMock: HttpTestingController;
  let expectedResult: IGameResult | IGameResult[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(GameResultService);
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

    it('should create a GameResult', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const gameResult = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(gameResult).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a GameResult', () => {
      const gameResult = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(gameResult).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a GameResult', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of GameResult', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a GameResult', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addGameResultToCollectionIfMissing', () => {
      it('should add a GameResult to an empty array', () => {
        const gameResult: IGameResult = sampleWithRequiredData;
        expectedResult = service.addGameResultToCollectionIfMissing([], gameResult);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gameResult);
      });

      it('should not add a GameResult to an array that contains it', () => {
        const gameResult: IGameResult = sampleWithRequiredData;
        const gameResultCollection: IGameResult[] = [
          {
            ...gameResult,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addGameResultToCollectionIfMissing(gameResultCollection, gameResult);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a GameResult to an array that doesn't contain it", () => {
        const gameResult: IGameResult = sampleWithRequiredData;
        const gameResultCollection: IGameResult[] = [sampleWithPartialData];
        expectedResult = service.addGameResultToCollectionIfMissing(gameResultCollection, gameResult);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gameResult);
      });

      it('should add only unique GameResult to an array', () => {
        const gameResultArray: IGameResult[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const gameResultCollection: IGameResult[] = [sampleWithRequiredData];
        expectedResult = service.addGameResultToCollectionIfMissing(gameResultCollection, ...gameResultArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const gameResult: IGameResult = sampleWithRequiredData;
        const gameResult2: IGameResult = sampleWithPartialData;
        expectedResult = service.addGameResultToCollectionIfMissing([], gameResult, gameResult2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(gameResult);
        expect(expectedResult).toContain(gameResult2);
      });

      it('should accept null and undefined values', () => {
        const gameResult: IGameResult = sampleWithRequiredData;
        expectedResult = service.addGameResultToCollectionIfMissing([], null, gameResult, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(gameResult);
      });

      it('should return initial array if no GameResult is added', () => {
        const gameResultCollection: IGameResult[] = [sampleWithRequiredData];
        expectedResult = service.addGameResultToCollectionIfMissing(gameResultCollection, undefined, null);
        expect(expectedResult).toEqual(gameResultCollection);
      });
    });

    describe('compareGameResult', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareGameResult(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareGameResult(entity1, entity2);
        const compareResult2 = service.compareGameResult(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareGameResult(entity1, entity2);
        const compareResult2 = service.compareGameResult(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareGameResult(entity1, entity2);
        const compareResult2 = service.compareGameResult(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
