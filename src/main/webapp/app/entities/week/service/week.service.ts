import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IWeek, NewWeek } from '../week.model';
import { NewWeekModel } from '../../../league-dashboard/new-round/new-week.model';

export type PartialUpdateWeek = Partial<IWeek> & Pick<IWeek, 'id'>;

type RestOf<T extends IWeek | NewWeek> = Omit<T, 'date'> & {
  date?: string | null;
};

export type RestWeek = RestOf<IWeek>;

export type NewRestWeek = RestOf<NewWeek>;

export type PartialUpdateRestWeek = RestOf<PartialUpdateWeek>;

export type EntityResponseType = HttpResponse<IWeek>;
export type EntityArrayResponseType = HttpResponse<IWeek[]>;

@Injectable({ providedIn: 'root' })
export class WeekService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/weeks');
  protected newWeekResourceUrl = this.applicationConfigService.getEndpointFor('api/new-week');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(week: NewWeek): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(week);
    return this.http.post<RestWeek>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  uploadNewRound(newWeekData: NewWeekModel, semesterId: number): Observable<EntityResponseType> {
    return this.http.post<any>(`${this.newWeekResourceUrl}/${semesterId}`, newWeekData);
  }

  update(week: IWeek): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(week);
    return this.http
      .put<RestWeek>(`${this.resourceUrl}/${this.getWeekIdentifier(week)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(week: PartialUpdateWeek): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(week);
    return this.http
      .patch<RestWeek>(`${this.resourceUrl}/${this.getWeekIdentifier(week)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestWeek>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestWeek[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getWeekIdentifier(week: Pick<IWeek, 'id'>): number {
    return week.id;
  }

  compareWeek(o1: Pick<IWeek, 'id'> | null, o2: Pick<IWeek, 'id'> | null): boolean {
    return o1 && o2 ? this.getWeekIdentifier(o1) === this.getWeekIdentifier(o2) : o1 === o2;
  }

  addWeekToCollectionIfMissing<Type extends Pick<IWeek, 'id'>>(
    weekCollection: Type[],
    ...weeksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const weeks: Type[] = weeksToCheck.filter(isPresent);
    if (weeks.length > 0) {
      const weekCollectionIdentifiers = weekCollection.map(weekItem => this.getWeekIdentifier(weekItem)!);
      const weeksToAdd = weeks.filter(weekItem => {
        const weekIdentifier = this.getWeekIdentifier(weekItem);
        if (weekCollectionIdentifiers.includes(weekIdentifier)) {
          return false;
        }
        weekCollectionIdentifiers.push(weekIdentifier);
        return true;
      });
      return [...weeksToAdd, ...weekCollection];
    }
    return weekCollection;
  }

  protected convertDateFromClient<T extends IWeek | NewWeek | PartialUpdateWeek>(week: T): RestOf<T> {
    return {
      ...week,
      date: week.date?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restWeek: RestWeek): IWeek {
    return {
      ...restWeek,
      date: restWeek.date ? dayjs(restWeek.date) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestWeek>): HttpResponse<IWeek> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestWeek[]>): HttpResponse<IWeek[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
