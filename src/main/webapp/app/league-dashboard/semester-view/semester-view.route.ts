import { Route } from '@angular/router';

//import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { SemesterViewComponent } from './semester-view.component';
import { NewRoundComponent } from '../new-round/new-round.component';

export const SemesterViewRoute: Route = {
  path: 'semester',
  component: SemesterViewComponent,
  data: {
    pageTitle: 'league.title',
  },
};
