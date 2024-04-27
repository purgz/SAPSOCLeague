import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { GameResultComponent } from '../list/game-result.component';
import { GameResultDetailComponent } from '../detail/game-result-detail.component';
import { GameResultUpdateComponent } from '../update/game-result-update.component';
import { GameResultRoutingResolveService } from './game-result-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const gameResultRoute: Routes = [
  {
    path: '',
    component: GameResultComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: GameResultDetailComponent,
    resolve: {
      gameResult: GameResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: GameResultUpdateComponent,
    resolve: {
      gameResult: GameResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: GameResultUpdateComponent,
    resolve: {
      gameResult: GameResultRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(gameResultRoute)],
  exports: [RouterModule],
})
export class GameResultRoutingModule {}
