import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { WeekFormService, WeekFormGroup } from './week-form.service';
import { IWeek } from '../week.model';
import { WeekService } from '../service/week.service';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';

@Component({
  selector: 'jhi-week-update',
  templateUrl: './week-update.component.html',
})
export class WeekUpdateComponent implements OnInit {
  isSaving = false;
  week: IWeek | null = null;

  semestersSharedCollection: ISemester[] = [];

  editForm: WeekFormGroup = this.weekFormService.createWeekFormGroup();

  constructor(
    protected weekService: WeekService,
    protected weekFormService: WeekFormService,
    protected semesterService: SemesterService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSemester = (o1: ISemester | null, o2: ISemester | null): boolean => this.semesterService.compareSemester(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ week }) => {
      this.week = week;
      if (week) {
        this.updateForm(week);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const week = this.weekFormService.getWeek(this.editForm);
    if (week.id !== null) {
      this.subscribeToSaveResponse(this.weekService.update(week));
    } else {
      this.subscribeToSaveResponse(this.weekService.create(week));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IWeek>>): void {
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

  protected updateForm(week: IWeek): void {
    this.week = week;
    this.weekFormService.resetForm(this.editForm, week);

    this.semestersSharedCollection = this.semesterService.addSemesterToCollectionIfMissing<ISemester>(
      this.semestersSharedCollection,
      week.semester
    );
  }

  protected loadRelationshipsOptions(): void {
    this.semesterService
      .query()
      .pipe(map((res: HttpResponse<ISemester[]>) => res.body ?? []))
      .pipe(
        map((semesters: ISemester[]) => this.semesterService.addSemesterToCollectionIfMissing<ISemester>(semesters, this.week?.semester))
      )
      .subscribe((semesters: ISemester[]) => (this.semestersSharedCollection = semesters));
  }
}
