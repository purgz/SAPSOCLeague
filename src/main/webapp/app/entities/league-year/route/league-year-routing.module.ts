import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeagueYearComponent } from '../list/league-year.component';
import { LeagueYearDetailComponent } from '../detail/league-year-detail.component';
import { LeagueYearUpdateComponent } from '../update/league-year-update.component';
import { LeagueYearRoutingResolveService } from './league-year-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const leagueYearRoute: Routes = [
  {
    path: '',
    component: LeagueYearComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LeagueYearDetailComponent,
    resolve: {
      leagueYear: LeagueYearRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LeagueYearUpdateComponent,
    resolve: {
      leagueYear: LeagueYearRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LeagueYearUpdateComponent,
    resolve: {
      leagueYear: LeagueYearRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(leagueYearRoute)],
  exports: [RouterModule],
})
export class LeagueYearRoutingModule {}
