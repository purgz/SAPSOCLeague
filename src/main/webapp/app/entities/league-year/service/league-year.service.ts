import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILeagueYear, NewLeagueYear } from '../league-year.model';

export type PartialUpdateLeagueYear = Partial<ILeagueYear> & Pick<ILeagueYear, 'id'>;

export type EntityResponseType = HttpResponse<ILeagueYear>;
export type EntityArrayResponseType = HttpResponse<ILeagueYear[]>;

@Injectable({ providedIn: 'root' })
export class LeagueYearService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/league-years');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(leagueYear: NewLeagueYear): Observable<EntityResponseType> {
    return this.http.post<ILeagueYear>(this.resourceUrl, leagueYear, { observe: 'response' });
  }

  update(leagueYear: ILeagueYear): Observable<EntityResponseType> {
    return this.http.put<ILeagueYear>(`${this.resourceUrl}/${this.getLeagueYearIdentifier(leagueYear)}`, leagueYear, {
      observe: 'response',
    });
  }

  partialUpdate(leagueYear: PartialUpdateLeagueYear): Observable<EntityResponseType> {
    return this.http.patch<ILeagueYear>(`${this.resourceUrl}/${this.getLeagueYearIdentifier(leagueYear)}`, leagueYear, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILeagueYear>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILeagueYear[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLeagueYearIdentifier(leagueYear: Pick<ILeagueYear, 'id'>): number {
    return leagueYear.id;
  }

  compareLeagueYear(o1: Pick<ILeagueYear, 'id'> | null, o2: Pick<ILeagueYear, 'id'> | null): boolean {
    return o1 && o2 ? this.getLeagueYearIdentifier(o1) === this.getLeagueYearIdentifier(o2) : o1 === o2;
  }

  addLeagueYearToCollectionIfMissing<Type extends Pick<ILeagueYear, 'id'>>(
    leagueYearCollection: Type[],
    ...leagueYearsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const leagueYears: Type[] = leagueYearsToCheck.filter(isPresent);
    if (leagueYears.length > 0) {
      const leagueYearCollectionIdentifiers = leagueYearCollection.map(leagueYearItem => this.getLeagueYearIdentifier(leagueYearItem)!);
      const leagueYearsToAdd = leagueYears.filter(leagueYearItem => {
        const leagueYearIdentifier = this.getLeagueYearIdentifier(leagueYearItem);
        if (leagueYearCollectionIdentifiers.includes(leagueYearIdentifier)) {
          return false;
        }
        leagueYearCollectionIdentifiers.push(leagueYearIdentifier);
        return true;
      });
      return [...leagueYearsToAdd, ...leagueYearCollection];
    }
    return leagueYearCollection;
  }
}
