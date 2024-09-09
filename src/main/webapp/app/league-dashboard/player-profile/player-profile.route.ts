import { Route } from '@angular/router';
import { PlayerProfileComponent } from './player-profile.component';

export const PlayerProfileRoute: Route = {
  path: 'profile/:profile-id',
  component: PlayerProfileComponent,
  data: {
    pageTitle: 'league.title',
  },
};
