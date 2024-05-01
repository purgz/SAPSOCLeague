import { Component, OnInit } from '@angular/core';

//components
import { LeagueYearsComponent } from './league-years/league-years.component';

@Component({
  selector: 'league-overview',
  templateUrl: './league-main.component.html',
})
export class LeagueMainComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
