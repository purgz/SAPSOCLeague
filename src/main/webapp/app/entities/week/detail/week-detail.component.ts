import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IWeek } from '../week.model';

@Component({
  selector: 'jhi-week-detail',
  templateUrl: './week-detail.component.html',
})
export class WeekDetailComponent implements OnInit {
  week: IWeek | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ week }) => {
      this.week = week;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
