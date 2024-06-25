import { Route } from '@angular/router';

import { NewRoundComponent } from '../new-round/new-round.component';

export const NewRoundRoute: Route = {
  path: 'semester/new-round',
  component: NewRoundComponent,
  data: {
    pageTitle: 'league.title',
  },
};
