import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LeagueYearFormService, LeagueYearFormGroup } from './league-year-form.service';
import { ILeagueYear } from '../league-year.model';
import { LeagueYearService } from '../service/league-year.service';

@Component({
  selector: 'jhi-league-year-update',
  templateUrl: './league-year-update.component.html',
})
export class LeagueYearUpdateComponent implements OnInit {
  isSaving = false;
  leagueYear: ILeagueYear | null = null;

  editForm: LeagueYearFormGroup = this.leagueYearFormService.createLeagueYearFormGroup();

  constructor(
    protected leagueYearService: LeagueYearService,
    protected leagueYearFormService: LeagueYearFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leagueYear }) => {
      this.leagueYear = leagueYear;
      if (leagueYear) {
        this.updateForm(leagueYear);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const leagueYear = this.leagueYearFormService.getLeagueYear(this.editForm);
    if (leagueYear.id !== null) {
      this.subscribeToSaveResponse(this.leagueYearService.update(leagueYear));
    } else {
      this.subscribeToSaveResponse(this.leagueYearService.create(leagueYear));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILeagueYear>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(leagueYear: ILeagueYear): void {
    this.leagueYear = leagueYear;
    this.leagueYearFormService.resetForm(this.editForm, leagueYear);
  }
}
