import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISemester } from '../semester.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../semester.test-samples';

import { SemesterService } from './semester.service';

const requireRestSample: ISemester = {
  ...sampleWithRequiredData,
};

describe('Semester Service', () => {
  let service: SemesterService;
  let httpMock: HttpTestingController;
  let expectedResult: ISemester | ISemester[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SemesterService);
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

    it('should create a Semester', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const semester = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(semester).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Semester', () => {
      const semester = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(semester).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Semester', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Semester', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Semester', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSemesterToCollectionIfMissing', () => {
      it('should add a Semester to an empty array', () => {
        const semester: ISemester = sampleWithRequiredData;
        expectedResult = service.addSemesterToCollectionIfMissing([], semester);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(semester);
      });

      it('should not add a Semester to an array that contains it', () => {
        const semester: ISemester = sampleWithRequiredData;
        const semesterCollection: ISemester[] = [
          {
            ...semester,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSemesterToCollectionIfMissing(semesterCollection, semester);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Semester to an array that doesn't contain it", () => {
        const semester: ISemester = sampleWithRequiredData;
        const semesterCollection: ISemester[] = [sampleWithPartialData];
        expectedResult = service.addSemesterToCollectionIfMissing(semesterCollection, semester);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(semester);
      });

      it('should add only unique Semester to an array', () => {
        const semesterArray: ISemester[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const semesterCollection: ISemester[] = [sampleWithRequiredData];
        expectedResult = service.addSemesterToCollectionIfMissing(semesterCollection, ...semesterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const semester: ISemester = sampleWithRequiredData;
        const semester2: ISemester = sampleWithPartialData;
        expectedResult = service.addSemesterToCollectionIfMissing([], semester, semester2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(semester);
        expect(expectedResult).toContain(semester2);
      });

      it('should accept null and undefined values', () => {
        const semester: ISemester = sampleWithRequiredData;
        expectedResult = service.addSemesterToCollectionIfMissing([], null, semester, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(semester);
      });

      it('should return initial array if no Semester is added', () => {
        const semesterCollection: ISemester[] = [sampleWithRequiredData];
        expectedResult = service.addSemesterToCollectionIfMissing(semesterCollection, undefined, null);
        expect(expectedResult).toEqual(semesterCollection);
      });
    });

    describe('compareSemester', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSemester(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSemester(entity1, entity2);
        const compareResult2 = service.compareSemester(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSemester(entity1, entity2);
        const compareResult2 = service.compareSemester(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSemester(entity1, entity2);
        const compareResult2 = service.compareSemester(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
