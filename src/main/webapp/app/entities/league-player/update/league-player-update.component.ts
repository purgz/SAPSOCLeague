import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { LeaguePlayerFormService, LeaguePlayerFormGroup } from './league-player-form.service';
import { ILeaguePlayer } from '../league-player.model';
import { LeaguePlayerService } from '../service/league-player.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';

@Component({
  selector: 'jhi-league-player-update',
  templateUrl: './league-player-update.component.html',
})
export class LeaguePlayerUpdateComponent implements OnInit {
  isSaving = false;
  leaguePlayer: ILeaguePlayer | null = null;

  semestersSharedCollection: ISemester[] = [];

  editForm: LeaguePlayerFormGroup = this.leaguePlayerFormService.createLeaguePlayerFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected leaguePlayerService: LeaguePlayerService,
    protected leaguePlayerFormService: LeaguePlayerFormService,
    protected semesterService: SemesterService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareSemester = (o1: ISemester | null, o2: ISemester | null): boolean => this.semesterService.compareSemester(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaguePlayer }) => {
      this.leaguePlayer = leaguePlayer;
      if (leaguePlayer) {
        this.updateForm(leaguePlayer);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('sapsocLeagueApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const leaguePlayer = this.leaguePlayerFormService.getLeaguePlayer(this.editForm);
    if (leaguePlayer.id !== null) {
      this.subscribeToSaveResponse(this.leaguePlayerService.update(leaguePlayer));
    } else {
      this.subscribeToSaveResponse(this.leaguePlayerService.create(leaguePlayer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILeaguePlayer>>): void {
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

  protected updateForm(leaguePlayer: ILeaguePlayer): void {
    this.leaguePlayer = leaguePlayer;
    this.leaguePlayerFormService.resetForm(this.editForm, leaguePlayer);

    this.semestersSharedCollection = this.semesterService.addSemesterToCollectionIfMissing<ISemester>(
      this.semestersSharedCollection,
      leaguePlayer.semester
    );
  }

  protected loadRelationshipsOptions(): void {
    this.semesterService
      .query()
      .pipe(map((res: HttpResponse<ISemester[]>) => res.body ?? []))
      .pipe(
        map((semesters: ISemester[]) =>
          this.semesterService.addSemesterToCollectionIfMissing<ISemester>(semesters, this.leaguePlayer?.semester)
        )
      )
      .subscribe((semesters: ISemester[]) => (this.semestersSharedCollection = semesters));
  }
}
