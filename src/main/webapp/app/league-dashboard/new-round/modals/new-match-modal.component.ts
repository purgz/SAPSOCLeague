import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewRoundService } from '../new-round.service';
import { ILeaguePlayer } from '../../../entities/league-player/league-player.model';
import { MatchModel } from '../match.model';

@Component({
  selector: 'new-match-modal',
  templateUrl: './new-match-modal.component.html',
})
export class NewMatchModalComponent implements OnInit {
  constructor(public activeModal: NgbActiveModal, public newRoundService: NewRoundService) {}

  player1: ILeaguePlayer | null = null;
  player2: ILeaguePlayer | null = null;

  ngOnInit(): void {
    console.log(this.newRoundService.allPlayers);
  }

  modalSave(): void {
    let newMatch = {} as MatchModel;

    newMatch.player1 = this.player1!;
    newMatch.player2 = this.player2!;

    const currentRound = this.newRoundService.selectedRoundEdit;
    const numMatches = Object.keys(this.newRoundService.newWeekData.rounds[currentRound].matches).length;
    this.newRoundService.newWeekData.rounds[currentRound].matches[numMatches + 1] = newMatch;
    this.activeModal.close();
  }

  closeModal(): void {
    //close without saving

    this.activeModal.close();
  }
}
