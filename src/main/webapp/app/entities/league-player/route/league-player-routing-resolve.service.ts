import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILeaguePlayer } from '../league-player.model';
import { LeaguePlayerService } from '../service/league-player.service';

@Injectable({ providedIn: 'root' })
export class LeaguePlayerRoutingResolveService implements Resolve<ILeaguePlayer | null> {
  constructor(protected service: LeaguePlayerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILeaguePlayer | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((leaguePlayer: HttpResponse<ILeaguePlayer>) => {
          if (leaguePlayer.body) {
            return of(leaguePlayer.body);
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
