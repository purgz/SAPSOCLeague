import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../week.test-samples';

import { WeekFormService } from './week-form.service';

describe('Week Form Service', () => {
  let service: WeekFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeekFormService);
  });

  describe('Service methods', () => {
    describe('createWeekFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createWeekFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            weekNum: expect.any(Object),
            date: expect.any(Object),
            semester: expect.any(Object),
          })
        );
      });

      it('passing IWeek should create a new form with FormGroup', () => {
        const formGroup = service.createWeekFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            weekNum: expect.any(Object),
            date: expect.any(Object),
            semester: expect.any(Object),
          })
        );
      });
    });

    describe('getWeek', () => {
      it('should return NewWeek for default Week initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createWeekFormGroup(sampleWithNewData);

        const week = service.getWeek(formGroup) as any;

        expect(week).toMatchObject(sampleWithNewData);
      });

      it('should return NewWeek for empty Week initial value', () => {
        const formGroup = service.createWeekFormGroup();

        const week = service.getWeek(formGroup) as any;

        expect(week).toMatchObject({});
      });

      it('should return IWeek', () => {
        const formGroup = service.createWeekFormGroup(sampleWithRequiredData);

        const week = service.getWeek(formGroup) as any;

        expect(week).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IWeek should not enable id FormControl', () => {
        const formGroup = service.createWeekFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewWeek should disable id FormControl', () => {
        const formGroup = service.createWeekFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
