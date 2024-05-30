import { Component, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';

//service
import { LeagueDataService } from '../service/league-data.service';
@Component({
  selector: 'semester-view',
  templateUrl: './semester-view.component.html',
  styleUrls: ['./semester-view.component.scss'],
})
export class SemesterViewComponent implements OnInit {
  constructor(private leagueYearService: LeagueYearService, public leagueDataService: LeagueDataService) {}

  ngOnInit(): void {}
}
