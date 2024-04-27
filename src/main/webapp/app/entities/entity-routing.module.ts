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
      {
        path: 'round',
        data: { pageTitle: 'sapsocLeagueApp.round.home.title' },
        loadChildren: () => import('./round/round.module').then(m => m.RoundModule),
      },
      {
        path: 'week',
        data: { pageTitle: 'sapsocLeagueApp.week.home.title' },
        loadChildren: () => import('./week/week.module').then(m => m.WeekModule),
      },
      {
        path: 'semester',
        data: { pageTitle: 'sapsocLeagueApp.semester.home.title' },
        loadChildren: () => import('./semester/semester.module').then(m => m.SemesterModule),
      },
      {
        path: 'semester-score',
        data: { pageTitle: 'sapsocLeagueApp.semesterScore.home.title' },
        loadChildren: () => import('./semester-score/semester-score.module').then(m => m.SemesterScoreModule),
      },
      {
        path: 'league-year',
        data: { pageTitle: 'sapsocLeagueApp.leagueYear.home.title' },
        loadChildren: () => import('./league-year/league-year.module').then(m => m.LeagueYearModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
