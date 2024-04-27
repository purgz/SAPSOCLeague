import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../semester.test-samples';

import { SemesterFormService } from './semester-form.service';

describe('Semester Form Service', () => {
  let service: SemesterFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemesterFormService);
  });

  describe('Service methods', () => {
    describe('createSemesterFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSemesterFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            semesterNum: expect.any(Object),
            year: expect.any(Object),
          })
        );
      });

      it('passing ISemester should create a new form with FormGroup', () => {
        const formGroup = service.createSemesterFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            semesterNum: expect.any(Object),
            year: expect.any(Object),
          })
        );
      });
    });

    describe('getSemester', () => {
      it('should return NewSemester for default Semester initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSemesterFormGroup(sampleWithNewData);

        const semester = service.getSemester(formGroup) as any;

        expect(semester).toMatchObject(sampleWithNewData);
      });

      it('should return NewSemester for empty Semester initial value', () => {
        const formGroup = service.createSemesterFormGroup();

        const semester = service.getSemester(formGroup) as any;

        expect(semester).toMatchObject({});
      });

      it('should return ISemester', () => {
        const formGroup = service.createSemesterFormGroup(sampleWithRequiredData);

        const semester = service.getSemester(formGroup) as any;

        expect(semester).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISemester should not enable id FormControl', () => {
        const formGroup = service.createSemesterFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSemester should disable id FormControl', () => {
        const formGroup = service.createSemesterFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
