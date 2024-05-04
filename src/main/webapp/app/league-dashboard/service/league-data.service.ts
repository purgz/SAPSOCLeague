import { Injectable } from '@angular/core';

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

  leaderBoard: [ILeaguePlayer, ISemesterScore[]][] = [];

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
    //going to move this so it's dealt with in another function because sometimes
    //want to refresh the data.
    if (this.leagueData[yearId]) {
      return false;
    }
    console.info('Attempting to add year ' + yearId + ' to the cached years.');
    //if a year is already found, then refresh it from backend

    const yearData: LeagueDataModel = {} as LeagueDataModel;
    yearData.year = {} as ILeagueYear;
    yearData.semesters = [];
    yearData.players = {} as {
      [playerId: number]: {
        player: ILeaguePlayer;
        score: Array<ISemesterScore>;
      };
    };

    //add years
    this.leagueYearService.find(yearId).subscribe(value => {
      if (value.body != null && value.status == HttpStatusCode.Ok) {
        yearData.year = value.body;
      }
    });

    /*
     This finds all the semesters by the year, then all the players, then their scores.
     Caches this data in one large object to prevent too many api requests unnecessarily.
     */
    this.semesterService.findByYear(yearId).subscribe(value => {
      if (value.body != null) {
        yearData.semesters = value.body;

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

                    this.leaderBoard.push([player, value.body]);
                  }
                }
              });
            });
          }
        });
      }
    });
    this.leagueData[yearId] = yearData;
    return false;
  }

  refresh(year: any): void {}
}
