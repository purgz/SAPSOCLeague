import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILeagueYear } from '../league-year.model';
import { LeagueYearService } from '../service/league-year.service';

@Injectable({ providedIn: 'root' })
export class LeagueYearRoutingResolveService implements Resolve<ILeagueYear | null> {
  constructor(protected service: LeagueYearService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILeagueYear | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((leagueYear: HttpResponse<ILeagueYear>) => {
          if (leagueYear.body) {
            return of(leagueYear.body);
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
