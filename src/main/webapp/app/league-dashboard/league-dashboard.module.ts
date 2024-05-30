import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { leagueRoutes } from './league-dashboard.route';
import { LeagueYearsComponent } from './league-years/league-years.component';
import { LeagueMainComponent } from './league-main.component';
import { SumScorePipe } from './pipes/sum-score.pipe';
import { SortScorePipe } from './pipes/sort-score.pipe';
import { SemesterViewComponent } from './semester-view/semester-view.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(leagueRoutes), SumScorePipe, SortScorePipe],
  declarations: [LeagueYearsComponent, LeagueMainComponent, SemesterViewComponent],
})
export class LeagueDashboardModule {}
