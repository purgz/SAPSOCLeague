import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SemesterComponent } from '../list/semester.component';
import { SemesterDetailComponent } from '../detail/semester-detail.component';
import { SemesterUpdateComponent } from '../update/semester-update.component';
import { SemesterRoutingResolveService } from './semester-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const semesterRoute: Routes = [
  {
    path: '',
    component: SemesterComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: SemesterDetailComponent,
    resolve: {
      semester: SemesterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: SemesterUpdateComponent,
    resolve: {
      semester: SemesterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: SemesterUpdateComponent,
    resolve: {
      semester: SemesterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(semesterRoute)],
  exports: [RouterModule],
})
export class SemesterRoutingModule {}
