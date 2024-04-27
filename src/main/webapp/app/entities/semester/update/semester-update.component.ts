import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SemesterFormService, SemesterFormGroup } from './semester-form.service';
import { ISemester } from '../semester.model';
import { SemesterService } from '../service/semester.service';
import { ILeagueYear } from 'app/entities/league-year/league-year.model';
import { LeagueYearService } from 'app/entities/league-year/service/league-year.service';

@Component({
  selector: 'jhi-semester-update',
  templateUrl: './semester-update.component.html',
})
export class SemesterUpdateComponent implements OnInit {
  isSaving = false;
  semester: ISemester | null = null;

  leagueYearsSharedCollection: ILeagueYear[] = [];

  editForm: SemesterFormGroup = this.semesterFormService.createSemesterFormGroup();

  constructor(
    protected semesterService: SemesterService,
    protected semesterFormService: SemesterFormService,
    protected leagueYearService: LeagueYearService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLeagueYear = (o1: ILeagueYear | null, o2: ILeagueYear | null): boolean => this.leagueYearService.compareLeagueYear(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semester }) => {
      this.semester = semester;
      if (semester) {
        this.updateForm(semester);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const semester = this.semesterFormService.getSemester(this.editForm);
    if (semester.id !== null) {
      this.subscribeToSaveResponse(this.semesterService.update(semester));
    } else {
      this.subscribeToSaveResponse(this.semesterService.create(semester));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISemester>>): void {
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

  protected updateForm(semester: ISemester): void {
    this.semester = semester;
    this.semesterFormService.resetForm(this.editForm, semester);

    this.leagueYearsSharedCollection = this.leagueYearService.addLeagueYearToCollectionIfMissing<ILeagueYear>(
      this.leagueYearsSharedCollection,
      semester.year
    );
  }

  protected loadRelationshipsOptions(): void {
    this.leagueYearService
      .query()
      .pipe(map((res: HttpResponse<ILeagueYear[]>) => res.body ?? []))
      .pipe(
        map((leagueYears: ILeagueYear[]) =>
          this.leagueYearService.addLeagueYearToCollectionIfMissing<ILeagueYear>(leagueYears, this.semester?.year)
        )
      )
      .subscribe((leagueYears: ILeagueYear[]) => (this.leagueYearsSharedCollection = leagueYears));
  }
}
