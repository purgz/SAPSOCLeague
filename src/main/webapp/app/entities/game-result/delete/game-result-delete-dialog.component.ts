import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IGameResult } from '../game-result.model';
import { GameResultService } from '../service/game-result.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './game-result-delete-dialog.component.html',
})
export class GameResultDeleteDialogComponent {
  gameResult?: IGameResult;

  constructor(protected gameResultService: GameResultService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.gameResultService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
