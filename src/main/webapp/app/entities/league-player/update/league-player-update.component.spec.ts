import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LeaguePlayerFormService } from './league-player-form.service';
import { LeaguePlayerService } from '../service/league-player.service';
import { ILeaguePlayer } from '../league-player.model';

import { LeaguePlayerUpdateComponent } from './league-player-update.component';

describe('LeaguePlayer Management Update Component', () => {
  let comp: LeaguePlayerUpdateComponent;
  let fixture: ComponentFixture<LeaguePlayerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leaguePlayerFormService: LeaguePlayerFormService;
  let leaguePlayerService: LeaguePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LeaguePlayerUpdateComponent],
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
      .overrideTemplate(LeaguePlayerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeaguePlayerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    leaguePlayerFormService = TestBed.inject(LeaguePlayerFormService);
    leaguePlayerService = TestBed.inject(LeaguePlayerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const leaguePlayer: ILeaguePlayer = { id: 456 };

      activatedRoute.data = of({ leaguePlayer });
      comp.ngOnInit();

      expect(comp.leaguePlayer).toEqual(leaguePlayer);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaguePlayer>>();
      const leaguePlayer = { id: 123 };
      jest.spyOn(leaguePlayerFormService, 'getLeaguePlayer').mockReturnValue(leaguePlayer);
      jest.spyOn(leaguePlayerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaguePlayer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaguePlayer }));
      saveSubject.complete();

      // THEN
      expect(leaguePlayerFormService.getLeaguePlayer).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(leaguePlayerService.update).toHaveBeenCalledWith(expect.objectContaining(leaguePlayer));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaguePlayer>>();
      const leaguePlayer = { id: 123 };
      jest.spyOn(leaguePlayerFormService, 'getLeaguePlayer').mockReturnValue({ id: null });
      jest.spyOn(leaguePlayerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaguePlayer: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leaguePlayer }));
      saveSubject.complete();

      // THEN
      expect(leaguePlayerFormService.getLeaguePlayer).toHaveBeenCalled();
      expect(leaguePlayerService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeaguePlayer>>();
      const leaguePlayer = { id: 123 };
      jest.spyOn(leaguePlayerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leaguePlayer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(leaguePlayerService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
