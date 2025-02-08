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

  findPlayerByFirstAndLastName(fname: String, lname: String): ILeaguePlayer | null {
    let players = this.getAvailablePlayers();

    for (let i = 0; i < players.length; i++) {
      //continue this
      if (players[i].firstName == fname && players[i].lastName == lname) {
        return players[i];
      }
    }
    return null;
  }

  //epic name
  fillNewWeekDataFromPrintFormat(data: String): void {
    //TODO write function to populate new week data based on below

    let lines = data.split('\n');
    console.log(lines);

    let i = 0;
    let roundCount = 0;
    let matchCount = 0;
    this.newWeekData.rounds[roundCount] = { matches: [], bye: null };
    while (lines[i] != 'END') {
      console.log(lines[i]);

      let matchOrBye = lines[i].split(' ');

      if (matchOrBye[0] == 'bye') {
        this.newWeekData.rounds[roundCount].bye = this.findPlayerByFirstAndLastName(matchOrBye[1], matchOrBye[2]);
      } else if (lines[i]) {
        //create new match
        const player1 = this.findPlayerByFirstAndLastName(matchOrBye[0], matchOrBye[1]);
        const player2 = this.findPlayerByFirstAndLastName(matchOrBye[2], matchOrBye[3]);
        const p1score = parseInt(matchOrBye[4]);
        const p2score = parseInt(matchOrBye[5]);
        this.newWeekData.rounds[roundCount].matches[matchCount] = {} as MatchModel;
        this.newWeekData.rounds[roundCount].matches[matchCount].player1 = player1!;
        this.newWeekData.rounds[roundCount].matches[matchCount].player2 = player2!;
        this.newWeekData.rounds[roundCount].matches[matchCount].p1Score = p1score;
        this.newWeekData.rounds[roundCount].matches[matchCount].p2Score = p2score;
        matchCount++;
      }
      //
      if (lines[i] == '' && i + 1 < lines.length && lines[i + 1] != 'END') {
        //create new round
        console.log('NEW ROUND');
        roundCount++;
        matchCount = 0;
        this.newWeekData.rounds[roundCount] = { matches: [], bye: null };
        //fix later
      }

      i++;
    }
    console.log(this.newWeekData);
  }

  printNewWeekData(): void {
    //would like a method to display the new week data
    // format
    /*
     rounds separated by empty new line
     matches separated by newline
     match ->   p1name p1surname p2name p2surname p1score p2score
     ...
     bye : byeplayername

     */
    let outFormat = '';

    for (let roundsKey in this.newWeekData.rounds) {
      let round = this.newWeekData.rounds[roundsKey];

      for (let matchesKey in round.matches) {
        let match = round.matches[matchesKey];
        if (match == null) {
          continue;
        }
        outFormat +=
          match.player1.firstName +
          ' ' +
          match.player1.lastName +
          ' ' +
          match.player2.firstName +
          ' ' +
          match.player2.lastName +
          ' ' +
          match.p1Score +
          ' ' +
          match.p2Score +
          '\n';
      }
      outFormat += 'bye ' + round.bye?.firstName + ' ' + round.bye?.lastName;
      outFormat += '\n\n';
    }
    outFormat += 'END';
    console.log(outFormat);
    navigator.clipboard.writeText(outFormat);

    this.fillNewWeekDataFromPrintFormat(outFormat);
  }
}
