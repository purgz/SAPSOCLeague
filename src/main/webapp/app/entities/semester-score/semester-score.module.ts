import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SemesterScoreComponent } from './list/semester-score.component';
import { SemesterScoreDetailComponent } from './detail/semester-score-detail.component';
import { SemesterScoreUpdateComponent } from './update/semester-score-update.component';
import { SemesterScoreDeleteDialogComponent } from './delete/semester-score-delete-dialog.component';
import { SemesterScoreRoutingModule } from './route/semester-score-routing.module';

@NgModule({
  imports: [SharedModule, SemesterScoreRoutingModule],
  declarations: [SemesterScoreComponent, SemesterScoreDetailComponent, SemesterScoreUpdateComponent, SemesterScoreDeleteDialogComponent],
})
export class SemesterScoreModule {}
