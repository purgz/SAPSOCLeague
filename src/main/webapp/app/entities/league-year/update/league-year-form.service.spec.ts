import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../league-year.test-samples';

import { LeagueYearFormService } from './league-year-form.service';

describe('LeagueYear Form Service', () => {
  let service: LeagueYearFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeagueYearFormService);
  });

  describe('Service methods', () => {
    describe('createLeagueYearFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLeagueYearFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            yearStart: expect.any(Object),
            yearEnd: expect.any(Object),
          })
        );
      });

      it('passing ILeagueYear should create a new form with FormGroup', () => {
        const formGroup = service.createLeagueYearFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            yearStart: expect.any(Object),
            yearEnd: expect.any(Object),
          })
        );
      });
    });

    describe('getLeagueYear', () => {
      it('should return NewLeagueYear for default LeagueYear initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLeagueYearFormGroup(sampleWithNewData);

        const leagueYear = service.getLeagueYear(formGroup) as any;

        expect(leagueYear).toMatchObject(sampleWithNewData);
      });

      it('should return NewLeagueYear for empty LeagueYear initial value', () => {
        const formGroup = service.createLeagueYearFormGroup();

        const leagueYear = service.getLeagueYear(formGroup) as any;

        expect(leagueYear).toMatchObject({});
      });

      it('should return ILeagueYear', () => {
        const formGroup = service.createLeagueYearFormGroup(sampleWithRequiredData);

        const leagueYear = service.getLeagueYear(formGroup) as any;

        expect(leagueYear).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILeagueYear should not enable id FormControl', () => {
        const formGroup = service.createLeagueYearFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLeagueYear should disable id FormControl', () => {
        const formGroup = service.createLeagueYearFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
