import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IGameResult } from '../game-result.model';

@Component({
  selector: 'jhi-game-result-detail',
  templateUrl: './game-result-detail.component.html',
})
export class GameResultDetailComponent implements OnInit {
  gameResult: IGameResult | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ gameResult }) => {
      this.gameResult = gameResult;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
