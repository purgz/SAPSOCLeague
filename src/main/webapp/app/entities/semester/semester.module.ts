import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { SemesterComponent } from './list/semester.component';
import { SemesterDetailComponent } from './detail/semester-detail.component';
import { SemesterUpdateComponent } from './update/semester-update.component';
import { SemesterDeleteDialogComponent } from './delete/semester-delete-dialog.component';
import { SemesterRoutingModule } from './route/semester-routing.module';

@NgModule({
  imports: [SharedModule, SemesterRoutingModule],
  declarations: [SemesterComponent, SemesterDetailComponent, SemesterUpdateComponent, SemesterDeleteDialogComponent],
})
export class SemesterModule {}
