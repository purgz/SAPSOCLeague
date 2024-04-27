import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { WeekComponent } from './list/week.component';
import { WeekDetailComponent } from './detail/week-detail.component';
import { WeekUpdateComponent } from './update/week-update.component';
import { WeekDeleteDialogComponent } from './delete/week-delete-dialog.component';
import { WeekRoutingModule } from './route/week-routing.module';

@NgModule({
  imports: [SharedModule, WeekRoutingModule],
  declarations: [WeekComponent, WeekDetailComponent, WeekUpdateComponent, WeekDeleteDialogComponent],
})
export class WeekModule {}
