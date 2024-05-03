import { Injectable } from '@angular/core';

//entities
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';
import { LeagueDataModel } from './league-data.model';

//services
import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class LeagueDataService {
  leagueData: { [yearId: number]: LeagueDataModel } = {};

  constructor(private leagueYearService: LeagueYearService) {}

  addYear(yearId: number): boolean {
    console.info('Attempting to add year ' + yearId + ' to the cached years.');
    //if a year is already found, then refresh it from backend

    const semesters = [];
    const players: { player: ILeaguePlayer; score: ISemesterScore }[] = [];

    const yearData: LeagueDataModel = {} as LeagueDataModel;
    yearData.year = {} as ILeagueYear;
    yearData.semesters = [];
    yearData.players = [];

    this.leagueYearService.find(yearId).subscribe(value => {
      if (value.body != null && value.status == HttpStatusCode.Ok) {
        yearData.year = value.body;
      }

      //find semesters in the year.

      //find players by year

      //find player semester scores by yearID and add them to player array
    });

    this.leagueData[yearId] = yearData;

    return false;
  }

  refresh(year: any): void {
    //refreshes a years data
  }
}
