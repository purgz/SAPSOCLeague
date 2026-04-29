import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';

//entities
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';
import { LeagueDataModel } from './league-data.model';

//services
import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { SemesterService } from '../../entities/semester/service/semester.service';
import { LeaguePlayerService } from '../../entities/league-player/service/league-player.service';
import { HttpStatusCode } from '@angular/common/http';
import { SemesterScoreService } from '../../entities/semester-score/service/semester-score.service';
import { Subscription } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LeagueDataService {
  leagueData: { [yearId: number]: LeagueDataModel } = {};

  selectedSemesterData: LeagueDataModel = {} as LeagueDataModel;

  //used to check if all the players have been found yet
  //calling .closed? in the template allows for pipe to use all values
  //and not render too early.
  playerSubscription: Subscription | undefined;

  constructor(
    private leaguePlayerService: LeaguePlayerService,
    private leagueYearService: LeagueYearService,
    private semesterService: SemesterService,
    private semesterScoreService: SemesterScoreService
  ) {}

  addYear(yearId: number): boolean {
    if (this.leagueData[yearId]) {
      return false;
    }

    return this.refreshYear(yearId);
  }

  refreshYear(yearId: number): boolean {
    const yearData: LeagueDataModel = {} as LeagueDataModel;
    yearData.year = {} as ILeagueYear;
    yearData.semesters = [];
    yearData.players = {} as any;

    this.leagueData[yearId] = yearData;

    // Step 1: get year + semesters + players all at once
    forkJoin([
      this.leagueYearService.find(yearId),
      this.semesterService.findByYear(yearId),
      this.leaguePlayerService.findByYear(yearId),
    ]).subscribe(([yearRes, semestersRes, playersRes]) => {
      if (yearRes.body) {
        yearData.year = yearRes.body as ILeagueYear;
      }
      if (semestersRes.body) {
        yearData.semesters = semestersRes.body as ISemester[];
      }

      if (playersRes.body && playersRes.body.length > 0) {
        const players = playersRes.body;

        // Step 2: fire ALL score requests simultaneously
        const scoreRequests = players.map(player => this.semesterScoreService.findByPlayerAndYear(player.id, yearId));

        forkJoin(scoreRequests).subscribe(scoreResponses => {
          // Step 3: assign ALL players at once — single re-render
          players.forEach((player, index) => {
            yearData.players[player.id] = {
              player: player,
              score: scoreResponses[index].body ?? [],
            };
          });

          // Trigger change detection once with a new reference
          this.leagueData[yearId] = { ...yearData };
        });
      }
    });

    return false;
  }

  setSemesterDetails(semId: number, yearId: number): void {
    this.selectedSemesterData = {} as LeagueDataModel;
    this.selectedSemesterData.year = {} as ILeagueYear;
    this.selectedSemesterData.semesters = [];
    this.selectedSemesterData.players = {} as {
      [playerId: number]: {
        player: ILeaguePlayer;
        score: Array<ISemesterScore>;
      };
    };

    if (!this.leagueData[yearId]) {
      this.addYear(yearId);
    }

    // Step 1: get semester + players at once
    forkJoin([this.semesterService.find(semId), this.leaguePlayerService.findBySemester(semId)]).subscribe(([semesterRes, playersRes]) => {
      if (semesterRes.body) {
        this.selectedSemesterData.year = this.leagueData[yearId].year;
        this.selectedSemesterData.semesters = [semesterRes.body];
      }

      if (playersRes.body && playersRes.body.length > 0) {
        const players = playersRes.body;

        // Step 2: fire ALL score requests simultaneously
        const scoreRequests = players.map(player => this.semesterScoreService.findByPlayerAndSem(player.id, semId));

        forkJoin(scoreRequests).subscribe(scoreResponses => {
          // Step 3: assign ALL players at once — single re-render
          players.forEach((player, index) => {
            this.selectedSemesterData.players[player.id] = {
              player: player,
              score: scoreResponses[index].body ?? [],
            };
          });

          // Save to localStorage once everything is ready
          localStorage.setItem('selectedSemesterData', JSON.stringify(this.selectedSemesterData));

          // Trigger change detection once with a new reference
          this.selectedSemesterData = { ...this.selectedSemesterData };
        });
      }
    });
  }

  clearSemesterData(): void {
    this.selectedSemesterData = {} as LeagueDataModel;
  }

  refresh(): void {
    Object.keys(this.leagueData).forEach(key => {
      this.refreshYear(parseInt(key));
    });
  }
}
