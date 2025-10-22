import { Route } from '@angular/router';

import { RoundViewComponent } from './round-view.component';

export const RoundViewRoute: Route = {
  path: 'match-history/:semester/:week',
  component: RoundViewComponent,
  data: {
    pageTitle: 'league.title',
  },
};
