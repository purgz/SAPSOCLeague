import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { leagueRoutes } from './league-dashboard.route';
import { LeagueYearsComponent } from './league-years/league-years.component';
import { LeagueMainComponent } from './league-main.component';
import { SumScorePipe } from './pipes/sum-score.pipe';
import { SortScorePipe } from './pipes/sort-score.pipe';
import { SemesterViewComponent } from './semester-view/semester-view.component';
import { SemesterScorePipe } from './pipes/semester-score-pipe';
import { NewRoundComponent } from './new-round/new-round.component';
import { PlayersModalComponent } from './new-round/modals/players-modal.component';
import { NewMatchModalComponent } from './new-round/modals/new-match-modal.component';
import { SortPlayerListPipe } from './pipes/sort-player-list.pipe';
import { PlayerProfileComponent } from './player-profile/player-profile.component';
import { MatchHistoryComponent } from './match-history/match-history.component';
import { RoundViewComponent } from './match-history/round-view.component';
import { EloBoardComponent } from './elo-leaderboard/elo-board.component';

@NgModule({
  imports: [SharedModule, RouterModule.forChild(leagueRoutes), SumScorePipe, SortScorePipe, SemesterScorePipe, SortPlayerListPipe],
  declarations: [
    LeagueYearsComponent,
    LeagueMainComponent,
    SemesterViewComponent,
    NewRoundComponent,
    PlayersModalComponent,
    NewMatchModalComponent,
    PlayerProfileComponent,
    MatchHistoryComponent,
    RoundViewComponent,
    EloBoardComponent,
  ],
})
export class LeagueDashboardModule {}
