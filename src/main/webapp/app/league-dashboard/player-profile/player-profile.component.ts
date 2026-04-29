import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpStatusCode } from '@angular/common/http';

import { LeaguePlayerService } from '../../entities/league-player/service/league-player.service';
import { GameResultService } from '../../entities/game-result/service/game-result.service';
import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { SemesterService } from '../../entities/semester/service/semester.service';

import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { IGameResult } from '../../entities/game-result/game-result.model';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';

@Component({
  selector: 'player-profile',
  templateUrl: './player-profile.component.html',
  styleUrls: ['./player-profile.component.scss'],
})
export class PlayerProfileComponent implements OnInit {
  public profileId: number | null = null;

  public leaguePlayer: ILeaguePlayer | null = null;
  public gameResults: IGameResult[] = [];

  public years: ILeagueYear[] = [];
  public semesters: ISemester[] = [];
  public allSemesters: ISemester[] = [];

  public selectedYearId: number | null = null;
  public selectedSemesterId: number | null = null;

  public filteredWins = 0;
  public filteredLosses = 0;
  public winPercentage = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    private leaguePlayerService: LeaguePlayerService,
    private gameResultService: GameResultService,
    private leagueYearService: LeagueYearService,
    private semesterService: SemesterService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.profileId = Number(params['profile-id']);

      if (!this.profileId) {
        return;
      }

      this.loadYears();
      this.loadSemesters();
      this.loadPlayer();
      this.loadGameResults();
    });
  }

  private loadYears(): void {
    this.leagueYearService.query().subscribe({
      next: response => {
        if (response.status === HttpStatusCode.Ok) {
          this.years = response.body ?? [];
        }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  private loadSemesters(): void {
    this.semesterService.query().subscribe({
      next: response => {
        if (response.status === HttpStatusCode.Ok) {
          this.semesters = response.body ?? [];
          this.allSemesters = response.body ?? [];
        }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  private loadPlayer(): void {
    this.leaguePlayerService.find(this.profileId!).subscribe({
      next: response => {
        if (response.status === HttpStatusCode.Ok) {
          this.leaguePlayer = response.body;
        }
      },
      error: err => {
        alert('Player not found');
        console.log(err);
      },
    });
  }

  private loadGameResults(): void {
    this.gameResultService.query().subscribe({
      next: response => {
        if (response.status === HttpStatusCode.Ok) {
          this.gameResults = response.body ?? [];
          this.calculateFilteredStats();
          console.log(this.gameResults);
        }
      },
      error: err => {
        console.log(err);
      },
    });
  }

  calculateFilteredStats(): void {
    if (!this.profileId) {
      return;
    }

    let filteredGames = [...this.gameResults];

    // Filter by selected year
    if (this.selectedYearId) {
      filteredGames = filteredGames.filter(game => {
        const round = game.round as any;
        return round?.week?.semester?.year?.id === this.selectedYearId;
      });
    }

    // Filter by selected semester
    if (this.selectedSemesterId) {
      filteredGames = filteredGames.filter(game => {
        const round = game.round as any;
        return round?.week?.semester?.id === this.selectedSemesterId;
      });
    }

    let wins = 0;
    let losses = 0;

    filteredGames.forEach(game => {
      const isPlayer1 = game.player1?.id === this.profileId;
      const isPlayer2 = game.player2?.id === this.profileId;

      if (!isPlayer1 && !isPlayer2) {
        return;
      }

      const playerScore = isPlayer1 ? game.p1Score : game.p2Score;
      const opponentScore = isPlayer1 ? game.p2Score : game.p1Score;

      if ((playerScore ?? 0) > (opponentScore ?? 0)) {
        wins++;
      } else {
        losses++;
      }
    });

    this.filteredWins = wins;
    this.filteredLosses = losses;
    this.winPercentage = this.calculateWinPercentage(wins, losses);
  }

  calculateWinPercentage(wins: number, losses: number): number {
    const total = wins + losses;

    if (total === 0) {
      return 0;
    }

    return Number(((wins / total) * 100).toFixed(2));
  }

  onYearChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedYearId = value ? Number(value) : null;

    // Reset semester filter when year changes
    this.selectedSemesterId = null;

    if (this.selectedYearId) {
      this.semesters = this.allSemesters.filter(semester => (semester.year as any)?.id === this.selectedYearId);
    } else {
      this.semesters = [...this.allSemesters];
    }

    this.calculateFilteredStats();
  }

  onSemesterChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.selectedSemesterId = value ? Number(value) : null;

    this.calculateFilteredStats();
  }
}
