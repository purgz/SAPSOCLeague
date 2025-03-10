import { Component, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';

import { FormControl } from '@angular/forms';

import { LeagueDataModel } from '../service/league-data.model';

//service
import { LeagueDataService } from '../service/league-data.service';
import { SemesterScoreService } from '../../entities/semester-score/service/semester-score.service';
import { HistoryService } from '../match-history/history-service';
import { Router } from '@angular/router';
@Component({
  selector: 'semester-view',
  templateUrl: './semester-view.component.html',
  styleUrls: ['./semester-view.component.scss'],
})
export class SemesterViewComponent implements OnInit {
  private adminFile: File | null = null;

  constructor(
    private leagueYearService: LeagueYearService,
    public leagueDataService: LeagueDataService,
    public semesterScoreService: SemesterScoreService,
    private historyService: HistoryService,
    private router: Router
  ) {}

  scoresFile = new FormControl();

  setHistoryData(): void {
    this.historyService.setWeeks(this.leagueDataService.selectedSemesterData.semesters[0].id);
    //routerLink="../match-history/{{ this.leagueDataService.selectedSemesterData.semesters[0].id }}"
    this.router.navigate(['/league/match-history/' + this.leagueDataService.selectedSemesterData.semesters[0].id]);
  }

  ngOnInit(): void {
    //check if selected semester is set
    //otherwise grab fromn local storage

    if (Object.keys(this.leagueDataService.selectedSemesterData).length === 0) {
      console.log('Semester data is empty');
      const saved = JSON.parse(localStorage.getItem('selectedSemesterData') || '{}') as LeagueDataModel;
      this.leagueDataService.selectedSemesterData.year = saved.year;
      this.leagueDataService.selectedSemesterData.players = saved.players;
      this.leagueDataService.selectedSemesterData.semesters = saved.semesters;
      console.log(saved);
    }
  }

  clearRoundStorage(): void {
    localStorage.setItem('selectedRoundPlayers', '{}');
    localStorage.setItem('allPlayers', '{}');
    localStorage.removeItem('newWeekData');
  }

  onFileSelect(event: Event): void {
    const file = (event.target! as HTMLInputElement).files![0]; // Here we use only the first file (single file)
    this.adminFile = file;
  }

  upload(): void {
    const request: any = new FormData();
    request.append('file', this.adminFile);
    request.append('semester', this.leagueDataService.selectedSemesterData.semesters[0].id);

    console.log(request);

    //upload the scores csv to admin
    this.semesterScoreService.uploadScoresFile(request).subscribe(value => {
      console.log(value.body);
    });
  }
}
