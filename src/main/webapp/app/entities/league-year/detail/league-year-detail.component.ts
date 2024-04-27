import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILeagueYear } from '../league-year.model';

@Component({
  selector: 'jhi-league-year-detail',
  templateUrl: './league-year-detail.component.html',
})
export class LeagueYearDetailComponent implements OnInit {
  leagueYear: ILeagueYear | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ leagueYear }) => {
      this.leagueYear = leagueYear;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
