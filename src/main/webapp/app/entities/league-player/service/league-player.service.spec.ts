import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILeaguePlayer } from '../league-player.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../league-player.test-samples';

import { LeaguePlayerService } from './league-player.service';

const requireRestSample: ILeaguePlayer = {
  ...sampleWithRequiredData,
};

describe('LeaguePlayer Service', () => {
  let service: LeaguePlayerService;
  let httpMock: HttpTestingController;
  let expectedResult: ILeaguePlayer | ILeaguePlayer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LeaguePlayerService);
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

    it('should create a LeaguePlayer', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const leaguePlayer = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(leaguePlayer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a LeaguePlayer', () => {
      const leaguePlayer = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(leaguePlayer).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a LeaguePlayer', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of LeaguePlayer', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a LeaguePlayer', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addLeaguePlayerToCollectionIfMissing', () => {
      it('should add a LeaguePlayer to an empty array', () => {
        const leaguePlayer: ILeaguePlayer = sampleWithRequiredData;
        expectedResult = service.addLeaguePlayerToCollectionIfMissing([], leaguePlayer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leaguePlayer);
      });

      it('should not add a LeaguePlayer to an array that contains it', () => {
        const leaguePlayer: ILeaguePlayer = sampleWithRequiredData;
        const leaguePlayerCollection: ILeaguePlayer[] = [
          {
            ...leaguePlayer,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addLeaguePlayerToCollectionIfMissing(leaguePlayerCollection, leaguePlayer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a LeaguePlayer to an array that doesn't contain it", () => {
        const leaguePlayer: ILeaguePlayer = sampleWithRequiredData;
        const leaguePlayerCollection: ILeaguePlayer[] = [sampleWithPartialData];
        expectedResult = service.addLeaguePlayerToCollectionIfMissing(leaguePlayerCollection, leaguePlayer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leaguePlayer);
      });

      it('should add only unique LeaguePlayer to an array', () => {
        const leaguePlayerArray: ILeaguePlayer[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const leaguePlayerCollection: ILeaguePlayer[] = [sampleWithRequiredData];
        expectedResult = service.addLeaguePlayerToCollectionIfMissing(leaguePlayerCollection, ...leaguePlayerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const leaguePlayer: ILeaguePlayer = sampleWithRequiredData;
        const leaguePlayer2: ILeaguePlayer = sampleWithPartialData;
        expectedResult = service.addLeaguePlayerToCollectionIfMissing([], leaguePlayer, leaguePlayer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(leaguePlayer);
        expect(expectedResult).toContain(leaguePlayer2);
      });

      it('should accept null and undefined values', () => {
        const leaguePlayer: ILeaguePlayer = sampleWithRequiredData;
        expectedResult = service.addLeaguePlayerToCollectionIfMissing([], null, leaguePlayer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(leaguePlayer);
      });

      it('should return initial array if no LeaguePlayer is added', () => {
        const leaguePlayerCollection: ILeaguePlayer[] = [sampleWithRequiredData];
        expectedResult = service.addLeaguePlayerToCollectionIfMissing(leaguePlayerCollection, undefined, null);
        expect(expectedResult).toEqual(leaguePlayerCollection);
      });
    });

    describe('compareLeaguePlayer', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareLeaguePlayer(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareLeaguePlayer(entity1, entity2);
        const compareResult2 = service.compareLeaguePlayer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareLeaguePlayer(entity1, entity2);
        const compareResult2 = service.compareLeaguePlayer(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareLeaguePlayer(entity1, entity2);
        const compareResult2 = service.compareLeaguePlayer(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
