import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISemester, NewSemester } from '../semester.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISemester for edit and NewSemesterFormGroupInput for create.
 */
type SemesterFormGroupInput = ISemester | PartialWithRequiredKeyOf<NewSemester>;

type SemesterFormDefaults = Pick<NewSemester, 'id'>;

type SemesterFormGroupContent = {
  id: FormControl<ISemester['id'] | NewSemester['id']>;
  semesterNum: FormControl<ISemester['semesterNum']>;
  year: FormControl<ISemester['year']>;
};

export type SemesterFormGroup = FormGroup<SemesterFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SemesterFormService {
  createSemesterFormGroup(semester: SemesterFormGroupInput = { id: null }): SemesterFormGroup {
    const semesterRawValue = {
      ...this.getFormDefaults(),
      ...semester,
    };
    return new FormGroup<SemesterFormGroupContent>({
      id: new FormControl(
        { value: semesterRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      semesterNum: new FormControl(semesterRawValue.semesterNum, {
        validators: [Validators.required, Validators.min(0)],
      }),
      year: new FormControl(semesterRawValue.year),
    });
  }

  getSemester(form: SemesterFormGroup): ISemester | NewSemester {
    return form.getRawValue() as ISemester | NewSemester;
  }

  resetForm(form: SemesterFormGroup, semester: SemesterFormGroupInput): void {
    const semesterRawValue = { ...this.getFormDefaults(), ...semester };
    form.reset(
      {
        ...semesterRawValue,
        id: { value: semesterRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SemesterFormDefaults {
    return {
      id: null,
    };
  }
}
