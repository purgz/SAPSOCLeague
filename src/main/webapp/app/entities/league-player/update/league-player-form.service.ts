import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ILeaguePlayer, NewLeaguePlayer } from '../league-player.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ILeaguePlayer for edit and NewLeaguePlayerFormGroupInput for create.
 */
type LeaguePlayerFormGroupInput = ILeaguePlayer | PartialWithRequiredKeyOf<NewLeaguePlayer>;

type LeaguePlayerFormDefaults = Pick<NewLeaguePlayer, 'id'>;

type LeaguePlayerFormGroupContent = {
  id: FormControl<ILeaguePlayer['id'] | NewLeaguePlayer['id']>;
  firstName: FormControl<ILeaguePlayer['firstName']>;
  lastName: FormControl<ILeaguePlayer['lastName']>;
  wins: FormControl<ILeaguePlayer['wins']>;
  losses: FormControl<ILeaguePlayer['losses']>;
  eloRating: FormControl<ILeaguePlayer['eloRating']>;
  dishes: FormControl<ILeaguePlayer['dishes']>;
  rDishes: FormControl<ILeaguePlayer['rDishes']>;
  photo: FormControl<ILeaguePlayer['photo']>;
  photoContentType: FormControl<ILeaguePlayer['photoContentType']>;
  semester: FormControl<ILeaguePlayer['semester']>;
};

export type LeaguePlayerFormGroup = FormGroup<LeaguePlayerFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class LeaguePlayerFormService {
  createLeaguePlayerFormGroup(leaguePlayer: LeaguePlayerFormGroupInput = { id: null }): LeaguePlayerFormGroup {
    const leaguePlayerRawValue = {
      ...this.getFormDefaults(),
      ...leaguePlayer,
    };
    return new FormGroup<LeaguePlayerFormGroupContent>({
      id: new FormControl(
        { value: leaguePlayerRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(leaguePlayerRawValue.firstName, {
        validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
      }),
      lastName: new FormControl(leaguePlayerRawValue.lastName, {
        validators: [Validators.minLength(1), Validators.maxLength(50)],
      }),
      wins: new FormControl(leaguePlayerRawValue.wins, {
        validators: [Validators.required, Validators.min(0)],
      }),
      losses: new FormControl(leaguePlayerRawValue.losses, {
        validators: [Validators.required, Validators.min(0)],
      }),
      eloRating: new FormControl(leaguePlayerRawValue.eloRating, {
        validators: [Validators.required, Validators.min(0)],
      }),
      dishes: new FormControl(leaguePlayerRawValue.dishes, {
        validators: [Validators.min(0)],
      }),
      rDishes: new FormControl(leaguePlayerRawValue.rDishes, {
        validators: [Validators.min(0)],
      }),
      photo: new FormControl(leaguePlayerRawValue.photo),
      photoContentType: new FormControl(leaguePlayerRawValue.photoContentType),
      semester: new FormControl(leaguePlayerRawValue.semester),
    });
  }

  getLeaguePlayer(form: LeaguePlayerFormGroup): ILeaguePlayer | NewLeaguePlayer {
    return form.getRawValue() as ILeaguePlayer | NewLeaguePlayer;
  }

  resetForm(form: LeaguePlayerFormGroup, leaguePlayer: LeaguePlayerFormGroupInput): void {
    const leaguePlayerRawValue = { ...this.getFormDefaults(), ...leaguePlayer };
    form.reset(
      {
        ...leaguePlayerRawValue,
        id: { value: leaguePlayerRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): LeaguePlayerFormDefaults {
    return {
      id: null,
    };
  }
}
