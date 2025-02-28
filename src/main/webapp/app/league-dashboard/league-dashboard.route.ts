import { Routes } from '@angular/router';

import { LeagueMainRoute } from './league-main.route';
import { SemesterViewRoute } from './semester-view/semester-view.route';
import { NewRoundRoute } from './new-round/new-round.route';
import { PlayerProfileRoute } from './player-profile/player-profile.route';
import { MatchHistoryRoute } from './match-history/match-history.route';
import { RoundViewRoute } from './match-history/round-view.route';

const routes = [LeagueMainRoute, SemesterViewRoute, NewRoundRoute, PlayerProfileRoute, MatchHistoryRoute, RoundViewRoute];

export const leagueRoutes: Routes = [
  {
    path: '',
    children: routes,
  },
];
