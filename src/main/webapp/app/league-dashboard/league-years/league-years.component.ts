import { Component, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';

@Component({
  selector: 'league-years',
  templateUrl: './league-years.component.html',
})
export class LeagueYearsComponent implements OnInit {
  constructor(private leagueYearService: LeagueYearService) {}

  isDataLoaded$: boolean = false;

  leagueYears: ILeagueYear[] = [];

  selectedYear: ILeagueYear = {} as ILeagueYear;

  ngOnInit(): void {
    this.leagueYearService.query().subscribe(value => {
      if (value.body != null) {
        this.leagueYears = value.body;
        this.isDataLoaded$ = true;
        this.selectedYear = this.leagueYears[0];

        //largest year first
        this.leagueYears.sort((a, b): number => {
          return b!.yearStart! - a!.yearStart!;
        });
      }
    });
  }

  /*
  want to have a dict of    year: [semesters....]

  so need method to get semesters BY year.

  display semesters for each year.


   */
}
