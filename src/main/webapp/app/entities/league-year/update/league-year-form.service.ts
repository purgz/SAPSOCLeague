import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILeagueYear, NewLeagueYear } from '../league-year.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILeagueYear for edit and NewLeagueYearFormGroupInput for create.
 */
type LeagueYearFormGroupInput = ILeagueYear | PartialWithRequiredKeyOf<NewLeagueYear>;

type LeagueYearFormDefaults = Pick<NewLeagueYear, 'id'>;

type LeagueYearFormGroupContent = {
  id: FormControl<ILeagueYear['id'] | NewLeagueYear['id']>;
  yearStart: FormControl<ILeagueYear['yearStart']>;
  yearEnd: FormControl<ILeagueYear['yearEnd']>;
};

export type LeagueYearFormGroup = FormGroup<LeagueYearFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LeagueYearFormService {
  createLeagueYearFormGroup(leagueYear: LeagueYearFormGroupInput = { id: null }): LeagueYearFormGroup {
    const leagueYearRawValue = {
      ...this.getFormDefaults(),
      ...leagueYear,
    };
    return new FormGroup<LeagueYearFormGroupContent>({
      id: new FormControl(
        { value: leagueYearRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      yearStart: new FormControl(leagueYearRawValue.yearStart, {
        validators: [Validators.required],
      }),
      yearEnd: new FormControl(leagueYearRawValue.yearEnd),
    });
  }

  getLeagueYear(form: LeagueYearFormGroup): ILeagueYear | NewLeagueYear {
    return form.getRawValue() as ILeagueYear | NewLeagueYear;
  }

  resetForm(form: LeagueYearFormGroup, leagueYear: LeagueYearFormGroupInput): void {
    const leagueYearRawValue = { ...this.getFormDefaults(), ...leagueYear };
    form.reset(
      {
        ...leagueYearRawValue,
        id: { value: leagueYearRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LeagueYearFormDefaults {
    return {
      id: null,
    };
  }
}
