import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { SemesterService } from '../service/semester.service';

import { SemesterComponent } from './semester.component';

describe('Semester Management Component', () => {
  let comp: SemesterComponent;
  let fixture: ComponentFixture<SemesterComponent>;
  let service: SemesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'semester', component: SemesterComponent }]), HttpClientTestingModule],
      declarations: [SemesterComponent],
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
      .overrideTemplate(SemesterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SemesterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(SemesterService);

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
    expect(comp.semesters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to semesterService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getSemesterIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getSemesterIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
