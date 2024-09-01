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

import { PlayersModalComponent } from './modals/players-modal.component';
import { MatchModel } from './match.model';
import { NewMatchModalComponent } from './modals/new-match-modal.component';
import { round } from '@popperjs/core/lib/utils/math';
import { NewWeekModel } from './new-week.model';

@Component({
  selector: 'new-round',
  templateUrl: './new-round.component.html',
  styleUrls: ['./new-round.component.css'],
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
    }
    const players = JSON.parse(localStorage.getItem('selectedRoundPlayers') || '{}') as ILeaguePlayer[];
    this.newRoundService.selectedRoundPlayers = players;

    const allPlayers = JSON.parse(localStorage.getItem('allPlayers') || '{}') as ILeaguePlayer[];
    this.newRoundService.allPlayers = allPlayers;

    //responsible for fetching nw week data if it exists, this is updated as the matches progress
    const newWeekData = JSON.parse(localStorage.getItem('newWeekData') || '{}');
    if (localStorage.getItem('newWeekData') === null) {
      this.newRoundService.newWeekData = { rounds: [] } as NewWeekModel;
    } else {
      this.newRoundService.newWeekData = newWeekData as NewWeekModel;
    }

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

  newMatchModal(roundNo: string): void {
    this.newRoundService.selectedRoundEdit = parseInt(roundNo);
    this.modalService.open(NewMatchModalComponent);
  }

  updateMatchScore(event: any, match: MatchModel, p1: boolean): void {
    const otherScore = event.target.value == 1 ? 0 : 1;
    if (p1) {
      match.p1Score = event.target.value;
      match.p2Score = otherScore;
    } else {
      match.p2Score = event.target.value;
      match.p1Score = otherScore;
    }
    this.newRoundService.setLocalStorage();
  }

  removeMatchFromRound(matchNo: string, roundNo: string): void {
    const mNo = parseInt(matchNo);
    const rNo = parseInt(roundNo);

    delete this.newRoundService.newWeekData.rounds[rNo].matches[mNo];

    this.newRoundService.setLocalStorage();
    console.log(this.newRoundService.newWeekData);
  }
}
