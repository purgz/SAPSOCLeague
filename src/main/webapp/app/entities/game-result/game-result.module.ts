import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { GameResultComponent } from './list/game-result.component';
import { GameResultDetailComponent } from './detail/game-result-detail.component';
import { GameResultUpdateComponent } from './update/game-result-update.component';
import { GameResultDeleteDialogComponent } from './delete/game-result-delete-dialog.component';
import { GameResultRoutingModule } from './route/game-result-routing.module';

@NgModule({
  imports: [SharedModule, GameResultRoutingModule],
  declarations: [GameResultComponent, GameResultDetailComponent, GameResultUpdateComponent, GameResultDeleteDialogComponent],
})
export class GameResultModule {}
