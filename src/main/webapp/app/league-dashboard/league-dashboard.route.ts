import { Routes } from '@angular/router';

import { LeagueMainRoute } from './league-main.route';
import { SemesterViewRoute } from './semester-view/semester-view.route';

const routes = [LeagueMainRoute, SemesterViewRoute];

export const leagueRoutes: Routes = [
  {
    path: '',
    children: routes,
  },
];
