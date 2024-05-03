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

@Injectable({ providedIn: 'root' })
export class LeagueDataService {
  leagueData: { [yearId: number]: LeagueDataModel } = {};

  constructor(
    private leaguePlayerService: LeaguePlayerService,
    private leagueYearService: LeagueYearService,
    private semesterService: SemesterService
  ) {}

  addYear(yearId: number): boolean {
    console.info('Attempting to add year ' + yearId + ' to the cached years.');
    //if a year is already found, then refresh it from backend

    const players: { player: ILeaguePlayer; score: ISemesterScore[] }[] = [];

    const yearData: LeagueDataModel = {} as LeagueDataModel;
    yearData.year = {} as ILeagueYear;
    yearData.semesters = [];
    yearData.players = players;

    this.leagueYearService.find(yearId).subscribe(value => {
      if (value.body != null && value.status == HttpStatusCode.Ok) {
        yearData.year = value.body;
      }

      //find semesters in the year - can run async
      this.semesterService.findByYear(yearId).subscribe(value => {
        if (value.body != null && value.status == HttpStatusCode.Ok) {
          yearData.semesters = value.body;

          yearData.semesters.forEach(semester => {
            this.leaguePlayerService.findBySemester(semester.id).subscribe(value => {
              if (value.body != null && value.status == HttpStatusCode.Ok) {
                value.body.forEach(player => {
                  const playerAndScore: { player: ILeaguePlayer; score: ISemesterScore[] } = {} as {
                    player: ILeaguePlayer;
                    score: ISemesterScore[];
                  };

                  playerAndScore.player = player;
                  yearData.players.push(playerAndScore);
                });
              }
              this.leagueData[yearId] = yearData;
              console.log(this.leagueData);
            });
          });
        }
      });
    });
    //find players and their semester scores by the year (year id)
    //find players

    //find semester score for each player.

    return false;
  }

  refresh(year: any): void {
    //refreshes a years data
  }
}
