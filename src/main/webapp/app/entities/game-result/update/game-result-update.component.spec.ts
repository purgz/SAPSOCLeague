import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { GameResultFormService } from './game-result-form.service';
import { GameResultService } from '../service/game-result.service';
import { IGameResult } from '../game-result.model';
import { ILeaguePlayer } from 'app/entities/league-player/league-player.model';
import { LeaguePlayerService } from 'app/entities/league-player/service/league-player.service';

import { GameResultUpdateComponent } from './game-result-update.component';

describe('GameResult Management Update Component', () => {
  let comp: GameResultUpdateComponent;
  let fixture: ComponentFixture<GameResultUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let gameResultFormService: GameResultFormService;
  let gameResultService: GameResultService;
  let leaguePlayerService: LeaguePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [GameResultUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(GameResultUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(GameResultUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    gameResultFormService = TestBed.inject(GameResultFormService);
    gameResultService = TestBed.inject(GameResultService);
    leaguePlayerService = TestBed.inject(LeaguePlayerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LeaguePlayer query and add missing value', () => {
      const gameResult: IGameResult = { id: 456 };
      const player1: ILeaguePlayer = { id: 62082 };
      gameResult.player1 = player1;
      const player2: ILeaguePlayer = { id: 91656 };
      gameResult.player2 = player2;

      const leaguePlayerCollection: ILeaguePlayer[] = [{ id: 35712 }];
      jest.spyOn(leaguePlayerService, 'query').mockReturnValue(of(new HttpResponse({ body: leaguePlayerCollection })));
      const additionalLeaguePlayers = [player1, player2];
      const expectedCollection: ILeaguePlayer[] = [...additionalLeaguePlayers, ...leaguePlayerCollection];
      jest.spyOn(leaguePlayerService, 'addLeaguePlayerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ gameResult });
      comp.ngOnInit();

      expect(leaguePlayerService.query).toHaveBeenCalled();
      expect(leaguePlayerService.addLeaguePlayerToCollectionIfMissing).toHaveBeenCalledWith(
        leaguePlayerCollection,
        ...additionalLeaguePlayers.map(expect.objectContaining)
      );
      expect(comp.leaguePlayersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const gameResult: IGameResult = { id: 456 };
      const player1: ILeaguePlayer = { id: 7701 };
      gameResult.player1 = player1;
      const player2: ILeaguePlayer = { id: 81196 };
      gameResult.player2 = player2;

      activatedRoute.data = of({ gameResult });
      comp.ngOnInit();

      expect(comp.leaguePlayersSharedCollection).toContain(player1);
      expect(comp.leaguePlayersSharedCollection).toContain(player2);
      expect(comp.gameResult).toEqual(gameResult);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameResult>>();
      const gameResult = { id: 123 };
      jest.spyOn(gameResultFormService, 'getGameResult').mockReturnValue(gameResult);
      jest.spyOn(gameResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gameResult }));
      saveSubject.complete();

      // THEN
      expect(gameResultFormService.getGameResult).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(gameResultService.update).toHaveBeenCalledWith(expect.objectContaining(gameResult));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameResult>>();
      const gameResult = { id: 123 };
      jest.spyOn(gameResultFormService, 'getGameResult').mockReturnValue({ id: null });
      jest.spyOn(gameResultService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameResult: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: gameResult }));
      saveSubject.complete();

      // THEN
      expect(gameResultFormService.getGameResult).toHaveBeenCalled();
      expect(gameResultService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IGameResult>>();
      const gameResult = { id: 123 };
      jest.spyOn(gameResultService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ gameResult });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(gameResultService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLeaguePlayer', () => {
      it('Should forward to leaguePlayerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(leaguePlayerService, 'compareLeaguePlayer');
        comp.compareLeaguePlayer(entity, entity2);
        expect(leaguePlayerService.compareLeaguePlayer).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
