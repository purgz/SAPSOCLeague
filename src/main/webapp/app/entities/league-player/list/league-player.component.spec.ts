import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { LeaguePlayerService } from '../service/league-player.service';

import { LeaguePlayerComponent } from './league-player.component';

describe('LeaguePlayer Management Component', () => {
  let comp: LeaguePlayerComponent;
  let fixture: ComponentFixture<LeaguePlayerComponent>;
  let service: LeaguePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'league-player', component: LeaguePlayerComponent }]), HttpClientTestingModule],
      declarations: [LeaguePlayerComponent],
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
      .overrideTemplate(LeaguePlayerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeaguePlayerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LeaguePlayerService);

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
    expect(comp.leaguePlayers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to leaguePlayerService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getLeaguePlayerIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getLeaguePlayerIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
