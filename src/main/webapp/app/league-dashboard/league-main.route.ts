import { Route } from '@angular/router';

//import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LeagueMainComponent } from './league-main.component';

export const LeagueMainRoute: Route = {
  path: '',
  component: LeagueMainComponent,
  data: {
    pageTitle: 'league.title',
  },
};
