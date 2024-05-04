import { Pipe, PipeTransform } from '@angular/core';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';

@Pipe({
  standalone: true,
  name: 'sortScore',
  pure: false,
})
export class SortScorePipe implements PipeTransform {
  transform(players: {
    [playerId: number]: {
      player: ILeaguePlayer;
      score: Array<ISemesterScore>;
    };
  }): { player: ILeaguePlayer; score: ISemesterScore[] }[] {
    const items = Object.keys(players).map(key => {
      return players[parseInt(key)];
    });

    items.sort((a: any, b: any) => {
      //return 0;
      return this.sumScores(b.score) - this.sumScores(a.score);
    });

    return items;
  }

  sumScores(scores: any): number {
    let total = 0;
    for (let i = 0; i < scores.length; i++) {
      total += scores[i].score;
    }
    return total;
  }
}
