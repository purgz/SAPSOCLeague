import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ISemesterScore } from '../semester-score.model';
import { SemesterScoreService } from '../service/semester-score.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './semester-score-delete-dialog.component.html',
})
export class SemesterScoreDeleteDialogComponent {
  semesterScore?: ISemesterScore;

  constructor(protected semesterScoreService: SemesterScoreService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.semesterScoreService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
