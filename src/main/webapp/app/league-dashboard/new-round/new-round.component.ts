import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { LeagueYearService } from '../../entities/league-year/service/league-year.service';
import { ILeagueYear } from '../../entities/league-year/league-year.model';
import { ISemester } from '../../entities/semester/semester.model';

import { FormControl } from '@angular/forms';

import { LeagueDataModel } from '../service/league-data.model';

//service
import { LeagueDataService } from '../service/league-data.service';
import { SemesterScoreService } from '../../entities/semester-score/service/semester-score.service';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { NewRoundService } from './new-round.service';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';

import { PlayersModalComponent } from './players-modal/players-modal.component';

@Component({
  selector: 'new-round',
  templateUrl: './new-round.component.html',
})
export class NewRoundComponent implements OnInit {
  constructor(
    private leagueYearService: LeagueYearService,
    public leagueDataService: LeagueDataService,
    public semesterScoreService: SemesterScoreService,
    private modalService: NgbModal,
    public newRoundService: NewRoundService
  ) {}

  //work on modal for new match results
  //updating the league model correctly.

  playerModalRef?: NgbModalRef;

  ngOnInit(): void {
    if (Object.keys(this.leagueDataService.selectedSemesterData).length === 0) {
      console.log('Semester data is empty');
      const saved = JSON.parse(localStorage.getItem('selectedSemesterData') || '{}') as LeagueDataModel;
      this.leagueDataService.selectedSemesterData.year = saved.year;
      this.leagueDataService.selectedSemesterData.players = saved.players;
      this.leagueDataService.selectedSemesterData.semesters = saved.semesters;
      console.log(saved);
    }
    const players = JSON.parse(localStorage.getItem('selectedRoundPlayers') || '{}') as ILeaguePlayer[];
    this.newRoundService.selectedRoundPlayers = players;

    const allPlayers = JSON.parse(localStorage.getItem('allPlayers') || '{}') as ILeaguePlayer[];
    this.newRoundService.allPlayers = allPlayers;

    //check if there is already values stored
    if (localStorage.getItem('selectedRoundPlayers') === '{}') {
      //no selected round players
      this.newRoundService.initAllPlayers();
    } else {
      console.log('Dont need to re initialize');
    }
  }

  openModal(): void {
    this.playerModalRef = this.modalService.open(PlayersModalComponent);
  }
}
