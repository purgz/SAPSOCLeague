import { Route } from '@angular/router';

//import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EloBoardComponent } from './elo-board.component';

export const EloBoardRoute: Route = {
  path: 'elo',
  component: EloBoardComponent,
  data: {
    pageTitle: 'league.title',
  },
};
