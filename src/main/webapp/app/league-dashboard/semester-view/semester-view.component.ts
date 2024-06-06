import { Component, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';

import { FormControl } from '@angular/forms';

import { LeagueDataModel } from '../service/league-data.model';

//service
import { LeagueDataService } from '../service/league-data.service';
import { SemesterScoreService } from '../../entities/semester-score/service/semester-score.service';
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
    public semesterScoreService: SemesterScoreService
  ) {}

  scoresFile = new FormControl();

  ngOnInit(): void {
    //check if selected semester is set
    //otherwise grab fromn local storage

    const saved = JSON.parse(localStorage.getItem('selectedSemesterData') || '{}') as LeagueDataModel;
    console.log('HELLO');
    console.log(saved);
    this.leagueDataService.selectedSemesterData = saved;
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
