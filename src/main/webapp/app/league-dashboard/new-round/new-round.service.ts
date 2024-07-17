import { Injectable } from '@angular/core';
import { LeagueDataService } from '../service/league-data.service';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';

@Injectable({ providedIn: 'root' })
export class NewRoundService {
  constructor(private leagueDataService: LeagueDataService) {}

  public selectedRoundPlayers: ILeaguePlayer[] = [];

  public allPlayers: ILeaguePlayer[] = [];

  //list the current semesters players;

  initAllPlayers(): void {
    this.allPlayers = this.getAvailablePlayers();
  }
  getAvailablePlayers(): ILeaguePlayer[] {
    return Object.values(this.leagueDataService.selectedSemesterData.players).map(value => {
      return value.player;
    });
  }

  addToWeek(player: ILeaguePlayer): void {
    alert('Added this player - alert only temporary');

    this.selectedRoundPlayers.push(player);
    this.allPlayers.splice(this.allPlayers.indexOf(player));
  }

  removePlayer(player: ILeaguePlayer): void {
    alert('Removing player');

    this.allPlayers.push(player);
    this.selectedRoundPlayers.splice(this.selectedRoundPlayers.indexOf(player));
  }

  //round-robin generation
  //start with randomizing array

  randomizeSelectedPlayers(): void {}

  //rotate players
  rotateSelectedPlayers(): void {}

  //Todo add the selected and remaning players to the local storage.
}
