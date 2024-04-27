import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'league-player',
        data: { pageTitle: 'sapsocLeagueApp.leaguePlayer.home.title' },
        loadChildren: () => import('./league-player/league-player.module').then(m => m.LeaguePlayerModule),
      },
      {
        path: 'game-result',
        data: { pageTitle: 'sapsocLeagueApp.gameResult.home.title' },
        loadChildren: () => import('./game-result/game-result.module').then(m => m.GameResultModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
