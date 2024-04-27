import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { GameResultFormService, GameResultFormGroup } from './game-result-form.service';
import { IGameResult } from '../game-result.model';
import { GameResultService } from '../service/game-result.service';
import { ILeaguePlayer } from 'app/entities/league-player/league-player.model';
import { LeaguePlayerService } from 'app/entities/league-player/service/league-player.service';
import { GameEnding } from 'app/entities/enumerations/game-ending.model';

@Component({
  selector: 'jhi-game-result-update',
  templateUrl: './game-result-update.component.html',
})
export class GameResultUpdateComponent implements OnInit {
  isSaving = false;
  gameResult: IGameResult | null = null;
  gameEndingValues = Object.keys(GameEnding);

  leaguePlayersSharedCollection: ILeaguePlayer[] = [];

  editForm: GameResultFormGroup = this.gameResultFormService.createGameResultFormGroup();

  constructor(
    protected gameResultService: GameResultService,
    protected gameResultFormService: GameResultFormService,
    protected leaguePlayerService: LeaguePlayerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareLeaguePlayer = (o1: ILeaguePlayer | null, o2: ILeaguePlayer | null): boolean =>
    this.leaguePlayerService.compareLeaguePlayer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gameResult }) => {
      this.gameResult = gameResult;
      if (gameResult) {
        this.updateForm(gameResult);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const gameResult = this.gameResultFormService.getGameResult(this.editForm);
    if (gameResult.id !== null) {
      this.subscribeToSaveResponse(this.gameResultService.update(gameResult));
    } else {
      this.subscribeToSaveResponse(this.gameResultService.create(gameResult));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IGameResult>>): void {
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

  protected updateForm(gameResult: IGameResult): void {
    this.gameResult = gameResult;
    this.gameResultFormService.resetForm(this.editForm, gameResult);

    this.leaguePlayersSharedCollection = this.leaguePlayerService.addLeaguePlayerToCollectionIfMissing<ILeaguePlayer>(
      this.leaguePlayersSharedCollection,
      gameResult.player1,
      gameResult.player2
    );
  }

  protected loadRelationshipsOptions(): void {
    this.leaguePlayerService
      .query()
      .pipe(map((res: HttpResponse<ILeaguePlayer[]>) => res.body ?? []))
      .pipe(
        map((leaguePlayers: ILeaguePlayer[]) =>
          this.leaguePlayerService.addLeaguePlayerToCollectionIfMissing<ILeaguePlayer>(
            leaguePlayers,
            this.gameResult?.player1,
            this.gameResult?.player2
          )
        )
      )
      .subscribe((leaguePlayers: ILeaguePlayer[]) => (this.leaguePlayersSharedCollection = leaguePlayers));
  }
}
