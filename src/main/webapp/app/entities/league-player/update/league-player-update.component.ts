import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { LeaguePlayerFormService, LeaguePlayerFormGroup } from './league-player-form.service';
import { ILeaguePlayer } from '../league-player.model';
import { LeaguePlayerService } from '../service/league-player.service';

@Component({
  selector: 'jhi-league-player-update',
  templateUrl: './league-player-update.component.html',
})
export class LeaguePlayerUpdateComponent implements OnInit {
  isSaving = false;
  leaguePlayer: ILeaguePlayer | null = null;

  editForm: LeaguePlayerFormGroup = this.leaguePlayerFormService.createLeaguePlayerFormGroup();

  constructor(
    protected leaguePlayerService: LeaguePlayerService,
    protected leaguePlayerFormService: LeaguePlayerFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaguePlayer }) => {
      this.leaguePlayer = leaguePlayer;
      if (leaguePlayer) {
        this.updateForm(leaguePlayer);
      }
    });
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
  }
}
