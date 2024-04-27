import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILeagueYear } from '../league-year.model';
import { LeagueYearService } from '../service/league-year.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './league-year-delete-dialog.component.html',
})
export class LeagueYearDeleteDialogComponent {
  leagueYear?: ILeagueYear;

  constructor(protected leagueYearService: LeagueYearService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.leagueYearService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
