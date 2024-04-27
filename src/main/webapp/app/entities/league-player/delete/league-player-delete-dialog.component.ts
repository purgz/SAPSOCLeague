import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILeaguePlayer } from '../league-player.model';
import { LeaguePlayerService } from '../service/league-player.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './league-player-delete-dialog.component.html',
})
export class LeaguePlayerDeleteDialogComponent {
  leaguePlayer?: ILeaguePlayer;

  constructor(protected leaguePlayerService: LeaguePlayerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.leaguePlayerService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
