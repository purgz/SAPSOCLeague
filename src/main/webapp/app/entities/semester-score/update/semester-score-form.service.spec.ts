import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../semester-score.test-samples';

import { SemesterScoreFormService } from './semester-score-form.service';

describe('SemesterScore Form Service', () => {
  let service: SemesterScoreFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SemesterScoreFormService);
  });

  describe('Service methods', () => {
    describe('createSemesterScoreFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createSemesterScoreFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            score: expect.any(Object),
            semester: expect.any(Object),
            player: expect.any(Object),
          })
        );
      });

      it('passing ISemesterScore should create a new form with FormGroup', () => {
        const formGroup = service.createSemesterScoreFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            score: expect.any(Object),
            semester: expect.any(Object),
            player: expect.any(Object),
          })
        );
      });
    });

    describe('getSemesterScore', () => {
      it('should return NewSemesterScore for default SemesterScore initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createSemesterScoreFormGroup(sampleWithNewData);

        const semesterScore = service.getSemesterScore(formGroup) as any;

        expect(semesterScore).toMatchObject(sampleWithNewData);
      });

      it('should return NewSemesterScore for empty SemesterScore initial value', () => {
        const formGroup = service.createSemesterScoreFormGroup();

        const semesterScore = service.getSemesterScore(formGroup) as any;

        expect(semesterScore).toMatchObject({});
      });

      it('should return ISemesterScore', () => {
        const formGroup = service.createSemesterScoreFormGroup(sampleWithRequiredData);

        const semesterScore = service.getSemesterScore(formGroup) as any;

        expect(semesterScore).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ISemesterScore should not enable id FormControl', () => {
        const formGroup = service.createSemesterScoreFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewSemesterScore should disable id FormControl', () => {
        const formGroup = service.createSemesterScoreFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
