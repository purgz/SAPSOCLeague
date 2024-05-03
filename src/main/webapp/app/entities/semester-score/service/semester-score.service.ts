import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISemesterScore, NewSemesterScore } from '../semester-score.model';

export type PartialUpdateSemesterScore = Partial<ISemesterScore> & Pick<ISemesterScore, 'id'>;

export type EntityResponseType = HttpResponse<ISemesterScore>;
export type EntityArrayResponseType = HttpResponse<ISemesterScore[]>;

@Injectable({ providedIn: 'root' })
export class SemesterScoreService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/semester-scores');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(semesterScore: NewSemesterScore): Observable<EntityResponseType> {
    return this.http.post<ISemesterScore>(this.resourceUrl, semesterScore, { observe: 'response' });
  }

  update(semesterScore: ISemesterScore): Observable<EntityResponseType> {
    return this.http.put<ISemesterScore>(`${this.resourceUrl}/${this.getSemesterScoreIdentifier(semesterScore)}`, semesterScore, {
      observe: 'response',
    });
  }

  partialUpdate(semesterScore: PartialUpdateSemesterScore): Observable<EntityResponseType> {
    return this.http.patch<ISemesterScore>(`${this.resourceUrl}/${this.getSemesterScoreIdentifier(semesterScore)}`, semesterScore, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISemesterScore>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  findByPlayerAndSem(pId: number, sId: number): Observable<EntityArrayResponseType> {
    return this.http.get<ISemesterScore[]>(`${this.resourceUrl}/${pId}/${sId}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISemesterScore[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSemesterScoreIdentifier(semesterScore: Pick<ISemesterScore, 'id'>): number {
    return semesterScore.id;
  }

  compareSemesterScore(o1: Pick<ISemesterScore, 'id'> | null, o2: Pick<ISemesterScore, 'id'> | null): boolean {
    return o1 && o2 ? this.getSemesterScoreIdentifier(o1) === this.getSemesterScoreIdentifier(o2) : o1 === o2;
  }

  addSemesterScoreToCollectionIfMissing<Type extends Pick<ISemesterScore, 'id'>>(
    semesterScoreCollection: Type[],
    ...semesterScoresToCheck: (Type | null | undefined)[]
  ): Type[] {
    const semesterScores: Type[] = semesterScoresToCheck.filter(isPresent);
    if (semesterScores.length > 0) {
      const semesterScoreCollectionIdentifiers = semesterScoreCollection.map(
        semesterScoreItem => this.getSemesterScoreIdentifier(semesterScoreItem)!
      );
      const semesterScoresToAdd = semesterScores.filter(semesterScoreItem => {
        const semesterScoreIdentifier = this.getSemesterScoreIdentifier(semesterScoreItem);
        if (semesterScoreCollectionIdentifiers.includes(semesterScoreIdentifier)) {
          return false;
        }
        semesterScoreCollectionIdentifiers.push(semesterScoreIdentifier);
        return true;
      });
      return [...semesterScoresToAdd, ...semesterScoreCollection];
    }
    return semesterScoreCollection;
  }
}
