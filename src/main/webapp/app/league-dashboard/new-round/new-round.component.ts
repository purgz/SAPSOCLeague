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
@Component({
  selector: 'new-round',
  templateUrl: './new-round.component.html',
})
export class NewRoundComponent implements OnInit {
  constructor(
    private leagueYearService: LeagueYearService,
    public leagueDataService: LeagueDataService,
    public semesterScoreService: SemesterScoreService,
    private modalService: NgbModal
  ) {}

  //work on modal for new match results
  //updating the league model correctly.

  @ViewChild('testModal') playerModal?: ElementRef;

  playerModalRef?: NgbModalRef;

  ngOnInit(): void {}

  openModal(): void {
    this.playerModalRef = this.modalService.open(this.playerModal);
  }

  modalSave(): void {
    //save changes to players and close

    this.playerModalRef?.close();
  }

  closeModal(): void {
    //close without saving

    this.playerModalRef?.close();
  }
}
