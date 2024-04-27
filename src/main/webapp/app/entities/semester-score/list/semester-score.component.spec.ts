import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SemesterScoreService } from '../service/semester-score.service';

import { SemesterScoreComponent } from './semester-score.component';

describe('SemesterScore Management Component', () => {
  let comp: SemesterScoreComponent;
  let fixture: ComponentFixture<SemesterScoreComponent>;
  let service: SemesterScoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'semester-score', component: SemesterScoreComponent }]), HttpClientTestingModule],
      declarations: [SemesterScoreComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(SemesterScoreComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SemesterScoreComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SemesterScoreService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.semesterScores?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to semesterScoreService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSemesterScoreIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSemesterScoreIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
