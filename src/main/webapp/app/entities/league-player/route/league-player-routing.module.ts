import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeaguePlayerComponent } from '../list/league-player.component';
import { LeaguePlayerDetailComponent } from '../detail/league-player-detail.component';
import { LeaguePlayerUpdateComponent } from '../update/league-player-update.component';
import { LeaguePlayerRoutingResolveService } from './league-player-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const leaguePlayerRoute: Routes = [
  {
    path: '',
    component: LeaguePlayerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LeaguePlayerDetailComponent,
    resolve: {
      leaguePlayer: LeaguePlayerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LeaguePlayerUpdateComponent,
    resolve: {
      leaguePlayer: LeaguePlayerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LeaguePlayerUpdateComponent,
    resolve: {
      leaguePlayer: LeaguePlayerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(leaguePlayerRoute)],
  exports: [RouterModule],
})
export class LeaguePlayerRoutingModule {}
