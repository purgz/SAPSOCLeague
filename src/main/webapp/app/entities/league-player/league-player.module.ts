import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LeaguePlayerComponent } from './list/league-player.component';
import { LeaguePlayerDetailComponent } from './detail/league-player-detail.component';
import { LeaguePlayerUpdateComponent } from './update/league-player-update.component';
import { LeaguePlayerDeleteDialogComponent } from './delete/league-player-delete-dialog.component';
import { LeaguePlayerRoutingModule } from './route/league-player-routing.module';

@NgModule({
  imports: [SharedModule, LeaguePlayerRoutingModule],
  declarations: [LeaguePlayerComponent, LeaguePlayerDetailComponent, LeaguePlayerUpdateComponent, LeaguePlayerDeleteDialogComponent],
})
export class LeaguePlayerModule {}
