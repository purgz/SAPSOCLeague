import { Route } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeagueYearsComponent } from './league-years.component';

export const LeagueYearsRoute: Route = {
  path: 'years',
  component: LeagueYearsComponent,
  data: {
    pageTitle: 'Years',
  },
};
