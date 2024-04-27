import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISemesterScore } from '../semester-score.model';
import { SemesterScoreService } from '../service/semester-score.service';

@Injectable({ providedIn: 'root' })
export class SemesterScoreRoutingResolveService implements Resolve<ISemesterScore | null> {
  constructor(protected service: SemesterScoreService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISemesterScore | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((semesterScore: HttpResponse<ISemesterScore>) => {
          if (semesterScore.body) {
            return of(semesterScore.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
