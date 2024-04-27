import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILeaguePlayer, NewLeaguePlayer } from '../league-player.model';

export type PartialUpdateLeaguePlayer = Partial<ILeaguePlayer> & Pick<ILeaguePlayer, 'id'>;

export type EntityResponseType = HttpResponse<ILeaguePlayer>;
export type EntityArrayResponseType = HttpResponse<ILeaguePlayer[]>;

@Injectable({ providedIn: 'root' })
export class LeaguePlayerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/league-players');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(leaguePlayer: NewLeaguePlayer): Observable<EntityResponseType> {
    return this.http.post<ILeaguePlayer>(this.resourceUrl, leaguePlayer, { observe: 'response' });
  }

  update(leaguePlayer: ILeaguePlayer): Observable<EntityResponseType> {
    return this.http.put<ILeaguePlayer>(`${this.resourceUrl}/${this.getLeaguePlayerIdentifier(leaguePlayer)}`, leaguePlayer, {
      observe: 'response',
    });
  }

  partialUpdate(leaguePlayer: PartialUpdateLeaguePlayer): Observable<EntityResponseType> {
    return this.http.patch<ILeaguePlayer>(`${this.resourceUrl}/${this.getLeaguePlayerIdentifier(leaguePlayer)}`, leaguePlayer, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILeaguePlayer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILeaguePlayer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getLeaguePlayerIdentifier(leaguePlayer: Pick<ILeaguePlayer, 'id'>): number {
    return leaguePlayer.id;
  }

  compareLeaguePlayer(o1: Pick<ILeaguePlayer, 'id'> | null, o2: Pick<ILeaguePlayer, 'id'> | null): boolean {
    return o1 && o2 ? this.getLeaguePlayerIdentifier(o1) === this.getLeaguePlayerIdentifier(o2) : o1 === o2;
  }

  addLeaguePlayerToCollectionIfMissing<Type extends Pick<ILeaguePlayer, 'id'>>(
    leaguePlayerCollection: Type[],
    ...leaguePlayersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const leaguePlayers: Type[] = leaguePlayersToCheck.filter(isPresent);
    if (leaguePlayers.length > 0) {
      const leaguePlayerCollectionIdentifiers = leaguePlayerCollection.map(
        leaguePlayerItem => this.getLeaguePlayerIdentifier(leaguePlayerItem)!
      );
      const leaguePlayersToAdd = leaguePlayers.filter(leaguePlayerItem => {
        const leaguePlayerIdentifier = this.getLeaguePlayerIdentifier(leaguePlayerItem);
        if (leaguePlayerCollectionIdentifiers.includes(leaguePlayerIdentifier)) {
          return false;
        }
        leaguePlayerCollectionIdentifiers.push(leaguePlayerIdentifier);
        return true;
      });
      return [...leaguePlayersToAdd, ...leaguePlayerCollection];
    }
    return leaguePlayerCollection;
  }
}
