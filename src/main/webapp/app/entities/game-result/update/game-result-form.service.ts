import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IGameResult, NewGameResult } from '../game-result.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IGameResult for edit and NewGameResultFormGroupInput for create.
 */
type GameResultFormGroupInput = IGameResult | PartialWithRequiredKeyOf<NewGameResult>;

type GameResultFormDefaults = Pick<NewGameResult, 'id'>;

type GameResultFormGroupContent = {
  id: FormControl<IGameResult['id'] | NewGameResult['id']>;
  gameEnding: FormControl<IGameResult['gameEnding']>;
  p1Score: FormControl<IGameResult['p1Score']>;
  p2Score: FormControl<IGameResult['p2Score']>;
  player1: FormControl<IGameResult['player1']>;
  player2: FormControl<IGameResult['player2']>;
  round: FormControl<IGameResult['round']>;
};

export type GameResultFormGroup = FormGroup<GameResultFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class GameResultFormService {
  createGameResultFormGroup(gameResult: GameResultFormGroupInput = { id: null }): GameResultFormGroup {
    const gameResultRawValue = {
      ...this.getFormDefaults(),
      ...gameResult,
    };
    return new FormGroup<GameResultFormGroupContent>({
      id: new FormControl(
        { value: gameResultRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      gameEnding: new FormControl(gameResultRawValue.gameEnding),
      p1Score: new FormControl(gameResultRawValue.p1Score, {
        validators: [Validators.min(0)],
      }),
      p2Score: new FormControl(gameResultRawValue.p2Score, {
        validators: [Validators.min(0)],
      }),
      player1: new FormControl(gameResultRawValue.player1),
      player2: new FormControl(gameResultRawValue.player2),
      round: new FormControl(gameResultRawValue.round),
    });
  }

  getGameResult(form: GameResultFormGroup): IGameResult | NewGameResult {
    return form.getRawValue() as IGameResult | NewGameResult;
  }

  resetForm(form: GameResultFormGroup, gameResult: GameResultFormGroupInput): void {
    const gameResultRawValue = { ...this.getFormDefaults(), ...gameResult };
    form.reset(
      {
        ...gameResultRawValue,
        id: { value: gameResultRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): GameResultFormDefaults {
    return {
      id: null,
    };
  }
}
