import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IWeek } from '../week.model';
import { WeekService } from '../service/week.service';

@Injectable({ providedIn: 'root' })
export class WeekRoutingResolveService implements Resolve<IWeek | null> {
  constructor(protected service: WeekService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IWeek | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((week: HttpResponse<IWeek>) => {
          if (week.body) {
            return of(week.body);
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
