import { Pipe, PipeTransform } from '@angular/core';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';

@Pipe({
  standalone: true,
  name: 'sumScore',
  pure: false,
})
export class SumScorePipe implements PipeTransform {
  transform(scores: ISemesterScore[]): number {
    let total = 0;
    for (let i = 0; i < scores.length; i++) {
      total += scores[i].score!;
    }

    return total;
  }
}
