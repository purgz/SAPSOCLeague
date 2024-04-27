import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { WeekComponent } from '../list/week.component';
import { WeekDetailComponent } from '../detail/week-detail.component';
import { WeekUpdateComponent } from '../update/week-update.component';
import { WeekRoutingResolveService } from './week-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const weekRoute: Routes = [
  {
    path: '',
    component: WeekComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: WeekDetailComponent,
    resolve: {
      week: WeekRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: WeekUpdateComponent,
    resolve: {
      week: WeekRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: WeekUpdateComponent,
    resolve: {
      week: WeekRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(weekRoute)],
  exports: [RouterModule],
})
export class WeekRoutingModule {}
