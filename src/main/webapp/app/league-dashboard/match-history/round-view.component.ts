import { Component, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';
import { FormControl } from '@angular/forms';
import { LeagueDataModel } from '../service/league-data.model';
import { LeagueDataService } from '../service/league-data.service';
import { SemesterScoreService } from '../../entities/semester-score/service/semester-score.service';

import { ActivatedRoute } from '@angular/router';
import { WeekService } from '../../entities/week/service/week.service';
import { IWeek } from '../../entities/week/week.model';
import { WeekExtended } from './week-extended.model';
import { HistoryService } from './history-service';
import { IGameResult } from '../../entities/game-result/game-result.model';
import { GameResultService } from '../../entities/game-result/service/game-result.service';

@Component({
  selector: 'round-view',
  templateUrl: './round-view.component.html',
  styleUrls: ['./round-view.component.scss'],
})
export class RoundViewComponent implements OnInit {
  public weekId: number | null = null;

  public week: WeekExtended | null = null;

  public gameResults: IGameResult[][] | null = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private weekService: WeekService,
    private historyService: HistoryService,
    private gameResultService: GameResultService
  ) {}

  ngOnInit(): void {
    //get semester id
    this.activatedRoute.params.subscribe(value => {
      this.weekId = value['week'];
      console.log(this.weekId);
      console.log(this.historyService.weeks);

      this.week = this.historyService.weeks?.find(week => week.id == this.weekId)!;

      this.gameResults = new Array(this.week?.rounds?.length);

      this.week?.rounds?.forEach(round => {
        this.gameResultService.findByRoundID(round.id).subscribe(value => {
          this.gameResults![round!.roundNo!] = value.body!;
        });
      });
    });
  }
}
