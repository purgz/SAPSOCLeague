import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { HttpClient, HttpStatusCode } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewRoundService } from '../new-round.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ILeaguePlayer, NewLeaguePlayer } from '../../../entities/league-player/league-player.model';
import { ISemester } from '../../../entities/semester/semester.model';
import { LeagueDataService } from '../../service/league-data.service';
import { LeaguePlayerService } from '../../../entities/league-player/service/league-player.service';

@Component({
  selector: 'players-list',
  templateUrl: './players-modal.component.html',
  styleUrls: ['./players-modal.component.scss'],
})
export class PlayersModalComponent implements OnInit {
  @ViewChild('templateRef', { static: true }) newPlayerModal!: any;

  userForm = new FormGroup({
    firstName: new FormControl(''), // FormControl for first name
    lastName: new FormControl(''), // FormControl for last name
  });

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    public newRoundService: NewRoundService,
    public leagueDataService: LeagueDataService,
    public leaguePlayerService: LeaguePlayerService
  ) {}

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

  createNewLeaguePlayer(): void {
    this.modalService.open(this.newPlayerModal);
  }

  submitNewPlayer(): void {
    const newPlayer = {} as NewLeaguePlayer;
    let player = {} as ILeaguePlayer;
    newPlayer.firstName = this.userForm.value.firstName;
    newPlayer.lastName = this.userForm.value.lastName;
    newPlayer.dishes = 0;
    newPlayer.wins = 0;
    newPlayer.losses = 0;
    newPlayer.eloRating = 1000;
    newPlayer.rDishes = 0;
    const semId = this.leagueDataService.selectedSemesterData.semesters[0].id;
    const semester = { id: semId } as ISemester;
    newPlayer.semesters = [semester];
    this.leaguePlayerService.create(newPlayer).subscribe(value => {
      if (value.status != 201) {
        console.log('Error creating new player - check internet');
        console.log(value.statusText);
        alert('Failed to create new league player try again');
      } else {
        player = value.body!;
        this.newRoundService.selectedRoundPlayers.unshift(player);
        this.newRoundService.setLocalStorage();
      }
    });
  }
}
