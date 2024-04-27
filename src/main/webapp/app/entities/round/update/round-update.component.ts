import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { RoundFormService, RoundFormGroup } from './round-form.service';
import { IRound } from '../round.model';
import { RoundService } from '../service/round.service';
import { IWeek } from 'app/entities/week/week.model';
import { WeekService } from 'app/entities/week/service/week.service';

@Component({
  selector: 'jhi-round-update',
  templateUrl: './round-update.component.html',
})
export class RoundUpdateComponent implements OnInit {
  isSaving = false;
  round: IRound | null = null;

  weeksSharedCollection: IWeek[] = [];

  editForm: RoundFormGroup = this.roundFormService.createRoundFormGroup();

  constructor(
    protected roundService: RoundService,
    protected roundFormService: RoundFormService,
    protected weekService: WeekService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareWeek = (o1: IWeek | null, o2: IWeek | null): boolean => this.weekService.compareWeek(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ round }) => {
      this.round = round;
      if (round) {
        this.updateForm(round);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const round = this.roundFormService.getRound(this.editForm);
    if (round.id !== null) {
      this.subscribeToSaveResponse(this.roundService.update(round));
    } else {
      this.subscribeToSaveResponse(this.roundService.create(round));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IRound>>): void {
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

  protected updateForm(round: IRound): void {
    this.round = round;
    this.roundFormService.resetForm(this.editForm, round);

    this.weeksSharedCollection = this.weekService.addWeekToCollectionIfMissing<IWeek>(this.weeksSharedCollection, round.week);
  }

  protected loadRelationshipsOptions(): void {
    this.weekService
      .query()
      .pipe(map((res: HttpResponse<IWeek[]>) => res.body ?? []))
      .pipe(map((weeks: IWeek[]) => this.weekService.addWeekToCollectionIfMissing<IWeek>(weeks, this.round?.week)))
      .subscribe((weeks: IWeek[]) => (this.weeksSharedCollection = weeks));
  }
}
