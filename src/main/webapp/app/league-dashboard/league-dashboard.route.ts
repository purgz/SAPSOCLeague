import { Routes } from '@angular/router';

import { LeagueMainRoute } from './league-main.route';
import { SemesterViewRoute } from './semester-view/semester-view.route';
import { NewRoundRoute } from './new-round/new-round.route';

const routes = [LeagueMainRoute, SemesterViewRoute, NewRoundRoute];

export const leagueRoutes: Routes = [
  {
    path: '',
    children: routes,
  },
];
