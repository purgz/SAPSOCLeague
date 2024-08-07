import { Injectable } from '@angular/core';
import { LeagueDataService } from '../service/league-data.service';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { NewWeekModel } from './new-week.model';
import { MatchModel } from './match.model';

@Injectable({ providedIn: 'root' })
export class NewRoundService {
  constructor(private leagueDataService: LeagueDataService) {}

  public selectedRoundPlayers: ILeaguePlayer[] = [];

  public allPlayers: ILeaguePlayer[] = [];

  public newWeekData: NewWeekModel = { rounds: [] } as NewWeekModel;

  //list the current semesters players;

  initAllPlayers(): void {
    this.allPlayers = this.getAvailablePlayers();
    this.selectedRoundPlayers = [];
    this.setLocalStorage();
  }
  getAvailablePlayers(): ILeaguePlayer[] {
    return Object.values(this.leagueDataService.selectedSemesterData.players).map(value => {
      return value.player;
    });
  }

  setLocalStorage(): void {
    localStorage.setItem('selectedRoundPlayers', JSON.stringify(this.selectedRoundPlayers));
    localStorage.setItem('allPlayers', JSON.stringify(this.allPlayers));
  }

  addToWeek(player: ILeaguePlayer): void {
    this.selectedRoundPlayers.unshift(player);
    this.allPlayers.splice(this.allPlayers.indexOf(player), 1);
    this.setLocalStorage();
  }

  removePlayer(player: ILeaguePlayer): void {
    this.allPlayers.push(player);
    this.selectedRoundPlayers.splice(this.selectedRoundPlayers.indexOf(player), 1);
    console.log(this.selectedRoundPlayers);
    console.log(this.allPlayers);
    this.setLocalStorage();
  }

  //round-robin generation
  //start with randomizing array

  randomizeSelectedPlayers(): void {
    //fisher yates (knuth) randomization alg - in place version

    for (let i = this.selectedRoundPlayers.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = this.selectedRoundPlayers[i];
      this.selectedRoundPlayers[i] = this.selectedRoundPlayers[j];
      this.selectedRoundPlayers[j] = temp;
    }
    this.setLocalStorage();
  }

  //rotate players
  rotateSelectedPlayers(): void {
    if (this.selectedRoundPlayers.length < 2) {
      return;
    }
    const end = this.selectedRoundPlayers.pop()!;
    this.selectedRoundPlayers.unshift(end);
    this.setLocalStorage();
  }

  //need to create new round object in backend.
  //each round - many match results
  generateNewRound(): void {
    if (Object.keys(this.newWeekData.rounds).length < 1) {
      console.log('First round randomizing players');
      this.randomizeSelectedPlayers();
    }
    const roundCount = Object.keys(this.newWeekData.rounds).length;
    this.newWeekData.rounds[roundCount] = { matches: [], bye: null };

    //loop through each pair of players;

    let matchNo = 0;
    let byeCheck = 2;
    if (this.selectedRoundPlayers.length % 2 === 0) {
      byeCheck = 1;
    }
    for (let i = 0; i < this.selectedRoundPlayers.length - byeCheck; i++) {
      this.newWeekData.rounds[roundCount].matches[matchNo] = {} as MatchModel;
      this.newWeekData.rounds[roundCount].matches[matchNo].player1 = this.selectedRoundPlayers[i];
      this.newWeekData.rounds[roundCount].matches[matchNo].player2 = this.selectedRoundPlayers[++i];
      matchNo++;
    }
    console.log(this.newWeekData);
    if (byeCheck === 2) {
      console.log('Odd number of players');
      console.log('Bye is given to ' + this.selectedRoundPlayers[this.selectedRoundPlayers.length - 1].firstName);
      this.newWeekData.rounds[roundCount].bye = this.selectedRoundPlayers[this.selectedRoundPlayers.length - 1];
    } else {
      this.newWeekData.rounds[roundCount].bye = null;
    }
    //rotate players for next generation
    this.rotateSelectedPlayers();

    //todo make match list pretty.
    //todo functionality for filling in scores !!!!
    //todo Add the week data results to local storage !!!
    //todo make POJO for week data
    //todo REST endpoint for receiving week data and persisting match results
    //todo for each match results - update semester scores (and maybe ELO?)
    //todo edit players mid round for a current match.
    //todo buttons to manually delete and add custom match to a ongoing round.

    //todo clear localstorage when saving week result !
    //todo Add a button to clear the week data !
    //todo make pipe to sort the players in the selection MODAL !
    //todo clear matches when first navigating to page !!
  }
}
