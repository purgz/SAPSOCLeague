import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IGameResult } from '../game-result.model';
import { GameResultService } from '../service/game-result.service';

@Injectable({ providedIn: 'root' })
export class GameResultRoutingResolveService implements Resolve<IGameResult | null> {
  constructor(protected service: GameResultService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IGameResult | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((gameResult: HttpResponse<IGameResult>) => {
          if (gameResult.body) {
            return of(gameResult.body);
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
