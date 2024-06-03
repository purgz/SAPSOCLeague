import { Pipe, PipeTransform } from '@angular/core';
import { ISemesterScore } from '../../entities/semester-score/semester-score.model';

@Pipe({
  standalone: true,
  name: 'semesterScore',
  pure: false,
})
export class SemesterScorePipe implements PipeTransform {
  transform(scores: ISemesterScore[], semesterId: number): number | null | undefined {
    for (let i = 0; i < scores.length; i++) {
      if (scores[i].semester!.id === semesterId) {
        return scores[i].score;
      }
    }

    return null;
  }
}
