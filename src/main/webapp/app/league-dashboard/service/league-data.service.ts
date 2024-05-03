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

    const yearData: LeagueDataModel = {} as LeagueDataModel;
    yearData.year = {} as ILeagueYear;
    yearData.semesters = [];
    yearData.players = {};

    this.leagueYearService.find(yearId).subscribe(value => {
      if (value.body != null && value.status == HttpStatusCode.Ok) {
        yearData.year = value.body;

        //get all semesters in this year.

        this.semesterService.findByYear(yearId).subscribe(value => {
          if (value != null && value.status == HttpStatusCode.Ok) {
            yearData.semesters = value.body!;

            yearData.semesters.forEach(semester => {
              this.leaguePlayerService.findBySemester(semester.id).subscribe(value => {
                if (value.body != null) {
                  value.body.forEach(player => {
                    //generate player extract to function later
                    const newPlayer: { player: ILeaguePlayer; score: ISemesterScore[] } = {} as {
                      player: ILeaguePlayer;
                      score: ISemesterScore[];
                    };
                    newPlayer.player = player;
                    yearData.players[newPlayer.player.id] = newPlayer;
                  });

                  this.leagueData[yearId] = yearData;
                }
              });
            });
          }
        });
      }
    });

    return false;
  }

  refresh(year: any): void {
    //refreshes a years data
  }

  getYears(id: number): void {
    this.leagueData[id].year;
  }

  getSemesters(id: number): void {
    this.leagueData[id].semesters;
  }

  getPlayersWithScore(id: number): void {
    for (let playersKey in this.leagueData[id].players) {
      console.log(this.leagueData[id].players[playersKey]);
    }
  }
}
