import { Pipe, PipeTransform } from '@angular/core';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';

@Pipe({
  standalone: true,
  name: 'sortPlayer',
  pure: false,
})
export class SortPlayerListPipe implements PipeTransform {
  transform(players: ILeaguePlayer[]): ILeaguePlayer[] {
    return players.sort((a: any, b: any) => {
      return a.firstName.localeCompare(b.firstName);
    });
  }
}
