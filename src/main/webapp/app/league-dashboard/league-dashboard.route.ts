import { Routes } from '@angular/router';

import { LeagueMainRoute } from './league-main.route';

const routes = [LeagueMainRoute];

export const leagueRoutes: Routes = [
  {
    path: '',
    children: routes,
  },
];
