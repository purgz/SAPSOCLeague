import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LeagueYearService } from '../service/league-year.service';

import { LeagueYearComponent } from './league-year.component';

describe('LeagueYear Management Component', () => {
  let comp: LeagueYearComponent;
  let fixture: ComponentFixture<LeagueYearComponent>;
  let service: LeagueYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'league-year', component: LeagueYearComponent }]), HttpClientTestingModule],
      declarations: [LeagueYearComponent],
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
      .overrideTemplate(LeagueYearComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeagueYearComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LeagueYearService);

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
    expect(comp.leagueYears?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to leagueYearService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLeagueYearIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLeagueYearIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
