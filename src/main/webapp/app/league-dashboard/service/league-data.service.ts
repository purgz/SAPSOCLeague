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
    console.info('Attempting to add year ' + yearId + ' to the cached years.');
    //if a year is already found, then refresh it from backend

    const sources = [this.leagueYearService.find(yearId), this.semesterService.findByYear(yearId)];

    const yearData: LeagueDataModel = {} as LeagueDataModel;
    yearData.year = {} as ILeagueYear;
    yearData.semesters = [];
    yearData.players = {} as {
      [playerId: number]: {
        player: ILeaguePlayer;
        score: Array<ISemesterScore>;
      };
    };

    //find semesters and years
    forkJoin(sources).subscribe(value => {
      console.log(value);

      if (value[0].body != null) {
        yearData.year = value[0].body as ILeagueYear;
      }

      if (value[1].body != null) {
        yearData.semesters = value[1].body as ISemester[];
      }
    });

    //find each player and their scores for the year
    this.playerSubscription = this.leaguePlayerService.findByYear(yearId).subscribe(value => {
      if (value.body != null) {
        value.body.forEach(player => {
          yearData.players[player.id] = {} as any;
          yearData.players[player.id].player = player;
          yearData.players[player.id].score = [];

          this.semesterScoreService.findByPlayerAndYear(player.id, yearId).subscribe(value => {
            if (value.body != null) {
              if (value.body.length > 0) {
                yearData.players[player.id].score = value.body;
              }
            }
          });
        });
      }
    });

    this.leagueData[yearId] = yearData;
    return false;
  }

  setSemesterDetails(semId: number, yearId: number): void {
    this.selectedSemesterData.year = {} as ILeagueYear;
    this.selectedSemesterData.semesters = [];
    this.selectedSemesterData.players = {} as {
      [playerId: number]: {
        player: ILeaguePlayer;
        score: Array<ISemesterScore>;
      };
    };

    console.log('getting semester specific info');

    this.selectedSemesterData.year = this.leagueData[yearId].year;

    this.semesterService.find(semId).subscribe(value => {
      if (value.body != null) {
        this.selectedSemesterData.semesters = [value.body];
      }
    });

    this.leaguePlayerService.findBySemester(semId).subscribe(value => {
      if (value.body != null) {
        value.body.forEach(player => {
          this.selectedSemesterData.players[player.id] = {} as any;
          this.selectedSemesterData.players[player.id].player = player;
          this.selectedSemesterData.players[player.id].score = [];

          this.semesterScoreService.findByPlayerAndSem(player.id, semId).subscribe(value => {
            if (value.body != null) {
              if (value.body.length > 0) {
                this.selectedSemesterData.players[player.id].score = value.body;
              }
            }
          });
        });
      }
    });

    console.log(this.selectedSemesterData);
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
