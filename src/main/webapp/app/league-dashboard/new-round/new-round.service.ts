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
    this.selectedRoundPlayers.push(player);
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
    this.newWeekData.rounds[1] = [];

    this.newWeekData.rounds[1][1] = {} as MatchModel;

    this.newWeekData.rounds[1][1].player1 = this.selectedRoundPlayers[0];

    console.log(this.newWeekData);
  }
}
