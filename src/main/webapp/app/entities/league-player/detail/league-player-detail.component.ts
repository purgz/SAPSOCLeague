import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILeaguePlayer } from '../league-player.model';

@Component({
  selector: 'jhi-league-player-detail',
  templateUrl: './league-player-detail.component.html',
})
export class LeaguePlayerDetailComponent implements OnInit {
  leaguePlayer: ILeaguePlayer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaguePlayer }) => {
      this.leaguePlayer = leaguePlayer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
