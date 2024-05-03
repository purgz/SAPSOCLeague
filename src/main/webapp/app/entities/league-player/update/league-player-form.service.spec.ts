import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../league-player.test-samples';

import { LeaguePlayerFormService } from './league-player-form.service';

describe('LeaguePlayer Form Service', () => {
  let service: LeaguePlayerFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaguePlayerFormService);
  });

  describe('Service methods', () => {
    describe('createLeaguePlayerFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createLeaguePlayerFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            wins: expect.any(Object),
            losses: expect.any(Object),
            eloRating: expect.any(Object),
            dishes: expect.any(Object),
            rDishes: expect.any(Object),
            photo: expect.any(Object),
            semesters: expect.any(Object),
          })
        );
      });

      it('passing ILeaguePlayer should create a new form with FormGroup', () => {
        const formGroup = service.createLeaguePlayerFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            wins: expect.any(Object),
            losses: expect.any(Object),
            eloRating: expect.any(Object),
            dishes: expect.any(Object),
            rDishes: expect.any(Object),
            photo: expect.any(Object),
            semesters: expect.any(Object),
          })
        );
      });
    });

    describe('getLeaguePlayer', () => {
      it('should return NewLeaguePlayer for default LeaguePlayer initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createLeaguePlayerFormGroup(sampleWithNewData);

        const leaguePlayer = service.getLeaguePlayer(formGroup) as any;

        expect(leaguePlayer).toMatchObject(sampleWithNewData);
      });

      it('should return NewLeaguePlayer for empty LeaguePlayer initial value', () => {
        const formGroup = service.createLeaguePlayerFormGroup();

        const leaguePlayer = service.getLeaguePlayer(formGroup) as any;

        expect(leaguePlayer).toMatchObject({});
      });

      it('should return ILeaguePlayer', () => {
        const formGroup = service.createLeaguePlayerFormGroup(sampleWithRequiredData);

        const leaguePlayer = service.getLeaguePlayer(formGroup) as any;

        expect(leaguePlayer).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ILeaguePlayer should not enable id FormControl', () => {
        const formGroup = service.createLeaguePlayerFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewLeaguePlayer should disable id FormControl', () => {
        const formGroup = service.createLeaguePlayerFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
