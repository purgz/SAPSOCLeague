import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IWeek, NewWeek } from '../week.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IWeek for edit and NewWeekFormGroupInput for create.
 */
type WeekFormGroupInput = IWeek | PartialWithRequiredKeyOf<NewWeek>;

type WeekFormDefaults = Pick<NewWeek, 'id'>;

type WeekFormGroupContent = {
  id: FormControl<IWeek['id'] | NewWeek['id']>;
  weekNum: FormControl<IWeek['weekNum']>;
  date: FormControl<IWeek['date']>;
  semester: FormControl<IWeek['semester']>;
};

export type WeekFormGroup = FormGroup<WeekFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class WeekFormService {
  createWeekFormGroup(week: WeekFormGroupInput = { id: null }): WeekFormGroup {
    const weekRawValue = {
      ...this.getFormDefaults(),
      ...week,
    };
    return new FormGroup<WeekFormGroupContent>({
      id: new FormControl(
        { value: weekRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      weekNum: new FormControl(weekRawValue.weekNum, {
        validators: [Validators.required, Validators.min(0)],
      }),
      date: new FormControl(weekRawValue.date),
      semester: new FormControl(weekRawValue.semester),
    });
  }

  getWeek(form: WeekFormGroup): IWeek | NewWeek {
    return form.getRawValue() as IWeek | NewWeek;
  }

  resetForm(form: WeekFormGroup, week: WeekFormGroupInput): void {
    const weekRawValue = { ...this.getFormDefaults(), ...week };
    form.reset(
      {
        ...weekRawValue,
        id: { value: weekRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): WeekFormDefaults {
    return {
      id: null,
    };
  }
}
