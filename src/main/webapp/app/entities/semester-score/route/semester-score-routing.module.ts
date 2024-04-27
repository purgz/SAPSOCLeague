import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SemesterScoreComponent } from '../list/semester-score.component';
import { SemesterScoreDetailComponent } from '../detail/semester-score-detail.component';
import { SemesterScoreUpdateComponent } from '../update/semester-score-update.component';
import { SemesterScoreRoutingResolveService } from './semester-score-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const semesterScoreRoute: Routes = [
  {
    path: '',
    component: SemesterScoreComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SemesterScoreDetailComponent,
    resolve: {
      semesterScore: SemesterScoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SemesterScoreUpdateComponent,
    resolve: {
      semesterScore: SemesterScoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SemesterScoreUpdateComponent,
    resolve: {
      semesterScore: SemesterScoreRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(semesterScoreRoute)],
  exports: [RouterModule],
})
export class SemesterScoreRoutingModule {}
