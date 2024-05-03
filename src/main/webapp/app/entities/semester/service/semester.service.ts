import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ISemester, NewSemester } from '../semester.model';

export type PartialUpdateSemester = Partial<ISemester> & Pick<ISemester, 'id'>;

export type EntityResponseType = HttpResponse<ISemester>;
export type EntityArrayResponseType = HttpResponse<ISemester[]>;

@Injectable({ providedIn: 'root' })
export class SemesterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/semesters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(semester: NewSemester): Observable<EntityResponseType> {
    return this.http.post<ISemester>(this.resourceUrl, semester, { observe: 'response' });
  }

  update(semester: ISemester): Observable<EntityResponseType> {
    return this.http.put<ISemester>(`${this.resourceUrl}/${this.getSemesterIdentifier(semester)}`, semester, { observe: 'response' });
  }

  partialUpdate(semester: PartialUpdateSemester): Observable<EntityResponseType> {
    return this.http.patch<ISemester>(`${this.resourceUrl}/${this.getSemesterIdentifier(semester)}`, semester, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ISemester>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ISemester[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  findByYear(id: number): Observable<EntityArrayResponseType> {
    return this.http.get<ISemester[]>(`${this.resourceUrl}/year/${id}`, { observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getSemesterIdentifier(semester: Pick<ISemester, 'id'>): number {
    return semester.id;
  }

  compareSemester(o1: Pick<ISemester, 'id'> | null, o2: Pick<ISemester, 'id'> | null): boolean {
    return o1 && o2 ? this.getSemesterIdentifier(o1) === this.getSemesterIdentifier(o2) : o1 === o2;
  }

  addSemesterToCollectionIfMissing<Type extends Pick<ISemester, 'id'>>(
    semesterCollection: Type[],
    ...semestersToCheck: (Type | null | undefined)[]
  ): Type[] {
    const semesters: Type[] = semestersToCheck.filter(isPresent);
    if (semesters.length > 0) {
      const semesterCollectionIdentifiers = semesterCollection.map(semesterItem => this.getSemesterIdentifier(semesterItem)!);
      const semestersToAdd = semesters.filter(semesterItem => {
        const semesterIdentifier = this.getSemesterIdentifier(semesterItem);
        if (semesterCollectionIdentifiers.includes(semesterIdentifier)) {
          return false;
        }
        semesterCollectionIdentifiers.push(semesterIdentifier);
        return true;
      });
      return [...semestersToAdd, ...semesterCollection];
    }
    return semesterCollection;
  }
}
