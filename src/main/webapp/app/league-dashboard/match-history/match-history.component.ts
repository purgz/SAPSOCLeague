import { Component, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';
import { FormControl } from '@angular/forms';
import { LeagueDataModel } from '../service/league-data.model';
import { LeagueDataService } from '../service/league-data.service';
import { SemesterScoreService } from '../../entities/semester-score/service/semester-score.service';

import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'match-history',
  templateUrl: './match-history.component.html',
  styleUrls: ['./match-history.component.scss'],
})
export class MatchHistoryComponent implements OnInit {
  public semId: number | null = null;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    //get semester id
    this.activatedRoute.params.subscribe(value => {
      this.semId = value['semester'];

      //get week data for semester
    });
  }
}