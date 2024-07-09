import { Injectable } from '@angular/core';
import { LeagueDataService } from '../service/league-data.service';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';

@Injectable({ providedIn: 'root' })
export class NewRoundService {
  constructor(private leagueDataService: LeagueDataService) {}

  private selectedRoundPlayers: ILeaguePlayer[] = [];

  //list the current semesters players;

  getAvailablePlayers(): ILeaguePlayer[] {
    return Object.values(this.leagueDataService.selectedSemesterData.players).map(value => {
      return value.player;
    });
  }
}
