import { Route } from '@angular/router';

import { MatchHistoryComponent } from './match-history.component';

export const MatchHistoryRoute: Route = {
  path: 'match-history/:semester',
  component: MatchHistoryComponent,
  data: {
    pageTitle: 'league.title',
  },
};
