import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../game-result.test-samples';

import { GameResultFormService } from './game-result-form.service';

describe('GameResult Form Service', () => {
  let service: GameResultFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameResultFormService);
  });

  describe('Service methods', () => {
    describe('createGameResultFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createGameResultFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gameEnding: expect.any(Object),
            p1Score: expect.any(Object),
            p2Score: expect.any(Object),
            player1: expect.any(Object),
            player2: expect.any(Object),
            round: expect.any(Object),
          })
        );
      });

      it('passing IGameResult should create a new form with FormGroup', () => {
        const formGroup = service.createGameResultFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            gameEnding: expect.any(Object),
            p1Score: expect.any(Object),
            p2Score: expect.any(Object),
            player1: expect.any(Object),
            player2: expect.any(Object),
            round: expect.any(Object),
          })
        );
      });
    });

    describe('getGameResult', () => {
      it('should return NewGameResult for default GameResult initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createGameResultFormGroup(sampleWithNewData);

        const gameResult = service.getGameResult(formGroup) as any;

        expect(gameResult).toMatchObject(sampleWithNewData);
      });

      it('should return NewGameResult for empty GameResult initial value', () => {
        const formGroup = service.createGameResultFormGroup();

        const gameResult = service.getGameResult(formGroup) as any;

        expect(gameResult).toMatchObject({});
      });

      it('should return IGameResult', () => {
        const formGroup = service.createGameResultFormGroup(sampleWithRequiredData);

        const gameResult = service.getGameResult(formGroup) as any;

        expect(gameResult).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IGameResult should not enable id FormControl', () => {
        const formGroup = service.createGameResultFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewGameResult should disable id FormControl', () => {
        const formGroup = service.createGameResultFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
