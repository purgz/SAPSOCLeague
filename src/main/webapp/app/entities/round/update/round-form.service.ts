import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IRound, NewRound } from '../round.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRound for edit and NewRoundFormGroupInput for create.
 */
type RoundFormGroupInput = IRound | PartialWithRequiredKeyOf<NewRound>;

type RoundFormDefaults = Pick<NewRound, 'id'>;

type RoundFormGroupContent = {
  id: FormControl<IRound['id'] | NewRound['id']>;
  roundNo: FormControl<IRound['roundNo']>;
  week: FormControl<IRound['week']>;
};

export type RoundFormGroup = FormGroup<RoundFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RoundFormService {
  createRoundFormGroup(round: RoundFormGroupInput = { id: null }): RoundFormGroup {
    const roundRawValue = {
      ...this.getFormDefaults(),
      ...round,
    };
    return new FormGroup<RoundFormGroupContent>({
      id: new FormControl(
        { value: roundRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      roundNo: new FormControl(roundRawValue.roundNo, {
        validators: [Validators.required, Validators.min(0)],
      }),
      week: new FormControl(roundRawValue.week),
    });
  }

  getRound(form: RoundFormGroup): IRound | NewRound {
    return form.getRawValue() as IRound | NewRound;
  }

  resetForm(form: RoundFormGroup, round: RoundFormGroupInput): void {
    const roundRawValue = { ...this.getFormDefaults(), ...round };
    form.reset(
      {
        ...roundRawValue,
        id: { value: roundRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): RoundFormDefaults {
    return {
      id: null,
    };
  }
}
