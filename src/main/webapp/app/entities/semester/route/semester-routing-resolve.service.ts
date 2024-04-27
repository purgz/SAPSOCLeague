import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ISemester } from '../semester.model';
import { SemesterService } from '../service/semester.service';

@Injectable({ providedIn: 'root' })
export class SemesterRoutingResolveService implements Resolve<ISemester | null> {
  constructor(protected service: SemesterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ISemester | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((semester: HttpResponse<ISemester>) => {
          if (semester.body) {
            return of(semester.body);
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
