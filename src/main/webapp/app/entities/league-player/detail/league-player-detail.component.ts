import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILeaguePlayer } from '../league-player.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-league-player-detail',
  templateUrl: './league-player-detail.component.html',
})
export class LeaguePlayerDetailComponent implements OnInit {
  leaguePlayer: ILeaguePlayer | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leaguePlayer }) => {
      this.leaguePlayer = leaguePlayer;
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
