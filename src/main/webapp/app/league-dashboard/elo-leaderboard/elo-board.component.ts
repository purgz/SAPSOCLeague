import { Component, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';

//service
import { LeagueDataService } from '../service/league-data.service';

import { LeaguePlayerService } from '../../entities/league-player/service/league-player.service';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';

@Component({
  selector: 'elo-board',
  templateUrl: './elo-board.component.html',
  styleUrls: ['./elo-board.component.scss'],
})
export class EloBoardComponent implements OnInit {
  constructor(private leaguePlayerService: LeaguePlayerService) {}

  allPlayers: ILeaguePlayer[] = [];

  ngOnInit(): void {
    this.leaguePlayerService.findAll().subscribe(value => {
      if (value.body != null) {
        this.allPlayers = value.body;

        this.allPlayers.sort((a, b): number => {
          return b!.eloRating! - a!.eloRating!;
        });

        // Removing people with exactly 1000 elo is not perfect but it removes inactives who have never played from the leaderboard
        // Should replace with an inactivity check but this works for now.
        for (let i = this.allPlayers.length - 1; i >= 0; i--) {
          if (this.allPlayers[i].eloRating == 1000 || this.allPlayers[i].eloRating == null) {
            this.allPlayers.splice(i, 1);
          }
        }
      }
    });
  }
}
