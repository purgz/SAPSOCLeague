import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { GameResultService } from '../service/game-result.service';

import { GameResultComponent } from './game-result.component';

describe('GameResult Management Component', () => {
  let comp: GameResultComponent;
  let fixture: ComponentFixture<GameResultComponent>;
  let service: GameResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'game-result', component: GameResultComponent }]), HttpClientTestingModule],
      declarations: [GameResultComponent],
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
      .overrideTemplate(GameResultComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GameResultComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(GameResultService);

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
    expect(comp.gameResults?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to gameResultService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getGameResultIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getGameResultIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
