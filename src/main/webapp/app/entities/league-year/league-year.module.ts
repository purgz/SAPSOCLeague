import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LeagueYearComponent } from './list/league-year.component';
import { LeagueYearDetailComponent } from './detail/league-year-detail.component';
import { LeagueYearUpdateComponent } from './update/league-year-update.component';
import { LeagueYearDeleteDialogComponent } from './delete/league-year-delete-dialog.component';
import { LeagueYearRoutingModule } from './route/league-year-routing.module';

@NgModule({
  imports: [SharedModule, LeagueYearRoutingModule],
  declarations: [LeagueYearComponent, LeagueYearDetailComponent, LeagueYearUpdateComponent, LeagueYearDeleteDialogComponent],
})
export class LeagueYearModule {}
