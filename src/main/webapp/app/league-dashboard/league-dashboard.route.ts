import { Routes } from '@angular/router';

import { LeagueYearsRoute } from './league-years/league-years.route';

const routes = [LeagueYearsRoute];

export const leagueRoutes: Routes = [
  {
    path: '',
    children: routes,
  },
];
