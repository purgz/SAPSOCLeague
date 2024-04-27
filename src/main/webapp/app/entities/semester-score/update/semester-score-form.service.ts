import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ISemesterScore, NewSemesterScore } from '../semester-score.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ISemesterScore for edit and NewSemesterScoreFormGroupInput for create.
 */
type SemesterScoreFormGroupInput = ISemesterScore | PartialWithRequiredKeyOf<NewSemesterScore>;

type SemesterScoreFormDefaults = Pick<NewSemesterScore, 'id'>;

type SemesterScoreFormGroupContent = {
  id: FormControl<ISemesterScore['id'] | NewSemesterScore['id']>;
  score: FormControl<ISemesterScore['score']>;
  semester: FormControl<ISemesterScore['semester']>;
  player: FormControl<ISemesterScore['player']>;
};

export type SemesterScoreFormGroup = FormGroup<SemesterScoreFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SemesterScoreFormService {
  createSemesterScoreFormGroup(semesterScore: SemesterScoreFormGroupInput = { id: null }): SemesterScoreFormGroup {
    const semesterScoreRawValue = {
      ...this.getFormDefaults(),
      ...semesterScore,
    };
    return new FormGroup<SemesterScoreFormGroupContent>({
      id: new FormControl(
        { value: semesterScoreRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      score: new FormControl(semesterScoreRawValue.score, {
        validators: [Validators.min(0)],
      }),
      semester: new FormControl(semesterScoreRawValue.semester),
      player: new FormControl(semesterScoreRawValue.player),
    });
  }

  getSemesterScore(form: SemesterScoreFormGroup): ISemesterScore | NewSemesterScore {
    return form.getRawValue() as ISemesterScore | NewSemesterScore;
  }

  resetForm(form: SemesterScoreFormGroup, semesterScore: SemesterScoreFormGroupInput): void {
    const semesterScoreRawValue = { ...this.getFormDefaults(), ...semesterScore };
    form.reset(
      {
        ...semesterScoreRawValue,
        id: { value: semesterScoreRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): SemesterScoreFormDefaults {
    return {
      id: null,
    };
  }
}
