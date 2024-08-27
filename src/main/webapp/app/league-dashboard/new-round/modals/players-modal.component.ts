import { Component, OnInit, NgZone, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewRoundService } from '../new-round.service';
import { FormControl, FormGroup } from '@angular/forms';
import { NewLeaguePlayer } from '../../../entities/league-player/league-player.model';
import { ISemester } from '../../../entities/semester/semester.model';
import { LeagueDataService } from '../../service/league-data.service';
import { LeaguePlayerService } from '../../../entities/league-player/service/league-player.service';

@Component({
  selector: 'players-list',
  templateUrl: './players-modal.component.html',
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
    console.log(this.userForm.value);

    const newPlayer = {} as NewLeaguePlayer;
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
    console.log(semester);
    console.log(newPlayer.semesters);
    this.leaguePlayerService.create(newPlayer).subscribe(value => {
      console.log(value.body);
    });
  }
}
