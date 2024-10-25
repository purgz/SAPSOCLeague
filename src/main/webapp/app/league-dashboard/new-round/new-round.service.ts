import { Injectable } from '@angular/core';
import { LeagueDataService } from '../service/league-data.service';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { NewWeekModel } from './new-week.model';
import { MatchModel } from './match.model';
import { WeekService } from '../../entities/week/service/week.service';
import { round } from '@popperjs/core/lib/utils/math';

interface MatchHistory {
  [playerId: number]: Set<number>; // Store a set of player IDs they have faced
}

@Injectable({ providedIn: 'root' })
export class NewRoundService {
  constructor(private leagueDataService: LeagueDataService, private weekService: WeekService) {}

  public selectedRoundPlayers: ILeaguePlayer[] = [];

  public allPlayers: ILeaguePlayer[] = [];

  public newWeekData: NewWeekModel = { rounds: [] } as NewWeekModel;

  public nullPlayer: ILeaguePlayer = {} as ILeaguePlayer;

  public matchHistory: MatchHistory = {} as MatchHistory;

  private hasPlayersChanged: boolean = false;

  selectedRoundEdit: number = -1;

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
    localStorage.setItem('newWeekData', JSON.stringify(this.newWeekData));
  }

  addToWeek(player: ILeaguePlayer): void {
    this.selectedRoundPlayers.unshift(player);
    this.allPlayers.splice(this.allPlayers.indexOf(player), 1);

    if (this.selectedRoundPlayers.includes(this.nullPlayer)) {
      this.selectedRoundPlayers.splice(this.selectedRoundPlayers.indexOf(this.nullPlayer), 1);
    } else {
      this.selectedRoundPlayers.push(this.nullPlayer);
    }

    this.setLocalStorage();
  }

  removePlayer(player: ILeaguePlayer): void {
    this.allPlayers.push(player);
    this.selectedRoundPlayers.splice(this.selectedRoundPlayers.indexOf(player), 1);

    if (this.selectedRoundPlayers.includes(this.nullPlayer)) {
      this.selectedRoundPlayers.splice(this.selectedRoundPlayers.indexOf(this.nullPlayer), 1);
    } else {
      this.selectedRoundPlayers.push(this.nullPlayer);
    }

    //randomize when a player is removed to try and reduce dupes
    //this.randomizeSelectedPlayers();
    // this.hasPlayersChanged = true;
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

    const numPlayers = this.selectedRoundPlayers.length;
    let byePlayer: ILeaguePlayer | null = null;
    const bye = this.selectedRoundPlayers.length % 2 !== 0;
    if (bye) {
      if (!this.selectedRoundPlayers.includes(this.nullPlayer)) {
        this.selectedRoundPlayers.push(this.nullPlayer);
      }
    }

    //rotate about the fixed first player;

    if (this.hasPlayersChanged) {
      const firstPlayer = this.selectedRoundPlayers[0];
      this.selectedRoundPlayers = [firstPlayer, ...this.selectedRoundPlayers.slice(-1), ...this.selectedRoundPlayers.slice(1, -1)];
      this.selectedRoundPlayers = [firstPlayer, ...this.selectedRoundPlayers.slice(-1), ...this.selectedRoundPlayers.slice(1, -1)];
      this.selectedRoundPlayers = [firstPlayer, ...this.selectedRoundPlayers.slice(-1), ...this.selectedRoundPlayers.slice(1, -1)];
    } else {
      const firstPlayer = this.selectedRoundPlayers[0];
      this.selectedRoundPlayers = [firstPlayer, ...this.selectedRoundPlayers.slice(-1), ...this.selectedRoundPlayers.slice(1, -1)];
    }

    this.hasPlayersChanged = false;

    const numMatches = Math.floor(this.selectedRoundPlayers.length / 2);

    for (let i = 0; i < numMatches; i++) {
      const player1 = this.selectedRoundPlayers[i];
      const player2 = this.selectedRoundPlayers[this.selectedRoundPlayers.length - 1 - i];

      if (Object.keys(player1).length == 0) {
        byePlayer = player2;
      } else if (Object.keys(player2).length == 0) {
        byePlayer = player1;
      } else {
        this.newWeekData.rounds[roundCount].matches[i] = {} as MatchModel;
        this.newWeekData.rounds[roundCount].matches[i].player1 = player1;
        this.newWeekData.rounds[roundCount].matches[i].player2 = player2;
      }
    }

    this.newWeekData.rounds[roundCount].bye = byePlayer;
    this.setLocalStorage();
  }

  uploadRound() {
    const semId = this.leagueDataService.selectedSemesterData.semesters[0].id;
    console.log('Selected semester ' + semId);
    this.weekService.uploadNewRound(this.newWeekData, semId).subscribe(value => {
      console.log(value.body);
    });
  }

  clearLocalData(): void {
    localStorage.removeItem('newWeekData');
  }

  unsorted(a: any, b: any) {
    return a;
  }
}

//todo option to add players to the semester in both the semester view and new week view
// if added in the new week view, then auto add to the list of selected players
