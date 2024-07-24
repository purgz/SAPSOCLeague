import { Component, OnInit, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewRoundService } from '../new-round.service';

@Component({
  selector: 'players-list',
  templateUrl: './players-modal.component.html',
})
export class PlayersModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, public newRoundService: NewRoundService) {}

  ngOnInit(): void {
    //console.log('HELLO WORLD');
    console.log(this.newRoundService.allPlayers);
  }

  modalSave(): void {
    //save changes to players and close

    this.activeModal.close();
  }

  closeModal(): void {
    //close without saving

    this.activeModal.close();
  }
}
