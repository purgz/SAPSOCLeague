import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { leagueRoutes } from './league-dashboard.route';
import { LeagueYearsComponent } from './league-years/league-years.component';
import { LeagueMainComponent } from './league-main.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(leagueRoutes)],
  declarations: [LeagueYearsComponent, LeagueMainComponent],
})
export class LeagueDashboardModule {}
