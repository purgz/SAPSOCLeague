import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISemesterScore } from '../semester-score.model';

@Component({
  selector: 'jhi-semester-score-detail',
  templateUrl: './semester-score-detail.component.html',
})
export class SemesterScoreDetailComponent implements OnInit {
  semesterScore: ISemesterScore | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semesterScore }) => {
      this.semesterScore = semesterScore;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
