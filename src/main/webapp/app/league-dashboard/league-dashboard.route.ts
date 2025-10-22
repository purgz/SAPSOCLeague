import { Routes } from '@angular/router';

import { LeagueMainRoute } from './league-main.route';
import { SemesterViewRoute } from './semester-view/semester-view.route';
import { NewRoundRoute } from './new-round/new-round.route';
import { PlayerProfileRoute } from './player-profile/player-profile.route';
import { MatchHistoryRoute } from './match-history/match-history.route';
import { RoundViewRoute } from './match-history/round-view.route';
import { EloBoardRoute } from './elo-leaderboard/elo-board.route';

const routes = [LeagueMainRoute, SemesterViewRoute, NewRoundRoute, PlayerProfileRoute, MatchHistoryRoute, RoundViewRoute, EloBoardRoute];

export const leagueRoutes: Routes = [
  {
    path: '',
    children: routes,
  },
];
