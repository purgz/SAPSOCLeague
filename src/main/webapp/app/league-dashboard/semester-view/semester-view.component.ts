import { Component, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';

import { FormControl } from '@angular/forms';

//service
import { LeagueDataService } from '../service/league-data.service';
import { SemesterScoreService } from '../../entities/semester-score/service/semester-score.service';
@Component({
  selector: 'semester-view',
  templateUrl: './semester-view.component.html',
  styleUrls: ['./semester-view.component.scss'],
})
export class SemesterViewComponent implements OnInit {
  constructor(
    private leagueYearService: LeagueYearService,
    public leagueDataService: LeagueDataService,
    public semesterScoreService: SemesterScoreService
  ) {}

  scoresFile = new FormControl();

  ngOnInit(): void {}

  onFileSelect(event: Event): void {
    const file = (event.target! as HTMLInputElement).files![0]; // Here we use only the first file (single file)
    console.log(file);
  }

  upload(): void {
    const formData = new FormData();
    // formData.append("file", this.scoresFile.getRawValue()); // Append the file to the FormData object

    /*
    this.semesterScoreService.uploadScoresFile(formData,
      this.leagueDataService.selectedSemesterData.semesters[0].id)
      .subscribe(value => {
        console.log(value.body);
      })


 */
  }
}
