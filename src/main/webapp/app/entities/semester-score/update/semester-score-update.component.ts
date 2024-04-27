import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { SemesterScoreFormService, SemesterScoreFormGroup } from './semester-score-form.service';
import { ISemesterScore } from '../semester-score.model';
import { SemesterScoreService } from '../service/semester-score.service';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';
import { ILeaguePlayer } from 'app/entities/league-player/league-player.model';
import { LeaguePlayerService } from 'app/entities/league-player/service/league-player.service';

@Component({
  selector: 'jhi-semester-score-update',
  templateUrl: './semester-score-update.component.html',
})
export class SemesterScoreUpdateComponent implements OnInit {
  isSaving = false;
  semesterScore: ISemesterScore | null = null;

  semestersSharedCollection: ISemester[] = [];
  leaguePlayersSharedCollection: ILeaguePlayer[] = [];

  editForm: SemesterScoreFormGroup = this.semesterScoreFormService.createSemesterScoreFormGroup();

  constructor(
    protected semesterScoreService: SemesterScoreService,
    protected semesterScoreFormService: SemesterScoreFormService,
    protected semesterService: SemesterService,
    protected leaguePlayerService: LeaguePlayerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSemester = (o1: ISemester | null, o2: ISemester | null): boolean => this.semesterService.compareSemester(o1, o2);

  compareLeaguePlayer = (o1: ILeaguePlayer | null, o2: ILeaguePlayer | null): boolean =>
    this.leaguePlayerService.compareLeaguePlayer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semesterScore }) => {
      this.semesterScore = semesterScore;
      if (semesterScore) {
        this.updateForm(semesterScore);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const semesterScore = this.semesterScoreFormService.getSemesterScore(this.editForm);
    if (semesterScore.id !== null) {
      this.subscribeToSaveResponse(this.semesterScoreService.update(semesterScore));
    } else {
      this.subscribeToSaveResponse(this.semesterScoreService.create(semesterScore));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ISemesterScore>>): void {
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

  protected updateForm(semesterScore: ISemesterScore): void {
    this.semesterScore = semesterScore;
    this.semesterScoreFormService.resetForm(this.editForm, semesterScore);

    this.semestersSharedCollection = this.semesterService.addSemesterToCollectionIfMissing<ISemester>(
      this.semestersSharedCollection,
      semesterScore.semester
    );
    this.leaguePlayersSharedCollection = this.leaguePlayerService.addLeaguePlayerToCollectionIfMissing<ILeaguePlayer>(
      this.leaguePlayersSharedCollection,
      semesterScore.player
    );
  }

  protected loadRelationshipsOptions(): void {
    this.semesterService
      .query()
      .pipe(map((res: HttpResponse<ISemester[]>) => res.body ?? []))
      .pipe(
        map((semesters: ISemester[]) =>
          this.semesterService.addSemesterToCollectionIfMissing<ISemester>(semesters, this.semesterScore?.semester)
        )
      )
      .subscribe((semesters: ISemester[]) => (this.semestersSharedCollection = semesters));

    this.leaguePlayerService
      .query()
      .pipe(map((res: HttpResponse<ILeaguePlayer[]>) => res.body ?? []))
      .pipe(
        map((leaguePlayers: ILeaguePlayer[]) =>
          this.leaguePlayerService.addLeaguePlayerToCollectionIfMissing<ILeaguePlayer>(leaguePlayers, this.semesterScore?.player)
        )
      )
      .subscribe((leaguePlayers: ILeaguePlayer[]) => (this.leaguePlayersSharedCollection = leaguePlayers));
  }
}
