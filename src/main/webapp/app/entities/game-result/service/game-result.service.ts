import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IGameResult, NewGameResult } from '../game-result.model';

export type PartialUpdateGameResult = Partial<IGameResult> & Pick<IGameResult, 'id'>;

export type EntityResponseType = HttpResponse<IGameResult>;
export type EntityArrayResponseType = HttpResponse<IGameResult[]>;

@Injectable({ providedIn: 'root' })
export class GameResultService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/game-results');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(gameResult: NewGameResult): Observable<EntityResponseType> {
    return this.http.post<IGameResult>(this.resourceUrl, gameResult, { observe: 'response' });
  }

  update(gameResult: IGameResult): Observable<EntityResponseType> {
    return this.http.put<IGameResult>(`${this.resourceUrl}/${this.getGameResultIdentifier(gameResult)}`, gameResult, {
      observe: 'response',
    });
  }

  partialUpdate(gameResult: PartialUpdateGameResult): Observable<EntityResponseType> {
    return this.http.patch<IGameResult>(`${this.resourceUrl}/${this.getGameResultIdentifier(gameResult)}`, gameResult, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IGameResult>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IGameResult[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getGameResultIdentifier(gameResult: Pick<IGameResult, 'id'>): number {
    return gameResult.id;
  }

  compareGameResult(o1: Pick<IGameResult, 'id'> | null, o2: Pick<IGameResult, 'id'> | null): boolean {
    return o1 && o2 ? this.getGameResultIdentifier(o1) === this.getGameResultIdentifier(o2) : o1 === o2;
  }

  addGameResultToCollectionIfMissing<Type extends Pick<IGameResult, 'id'>>(
    gameResultCollection: Type[],
    ...gameResultsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const gameResults: Type[] = gameResultsToCheck.filter(isPresent);
    if (gameResults.length > 0) {
      const gameResultCollectionIdentifiers = gameResultCollection.map(gameResultItem => this.getGameResultIdentifier(gameResultItem)!);
      const gameResultsToAdd = gameResults.filter(gameResultItem => {
        const gameResultIdentifier = this.getGameResultIdentifier(gameResultItem);
        if (gameResultCollectionIdentifiers.includes(gameResultIdentifier)) {
          return false;
        }
        gameResultCollectionIdentifiers.push(gameResultIdentifier);
        return true;
      });
      return [...gameResultsToAdd, ...gameResultCollection];
    }
    return gameResultCollection;
  }
}
