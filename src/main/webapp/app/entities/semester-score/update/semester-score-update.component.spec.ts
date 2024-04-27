import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SemesterScoreFormService } from './semester-score-form.service';
import { SemesterScoreService } from '../service/semester-score.service';
import { ISemesterScore } from '../semester-score.model';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';
import { ILeaguePlayer } from 'app/entities/league-player/league-player.model';
import { LeaguePlayerService } from 'app/entities/league-player/service/league-player.service';

import { SemesterScoreUpdateComponent } from './semester-score-update.component';

describe('SemesterScore Management Update Component', () => {
  let comp: SemesterScoreUpdateComponent;
  let fixture: ComponentFixture<SemesterScoreUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let semesterScoreFormService: SemesterScoreFormService;
  let semesterScoreService: SemesterScoreService;
  let semesterService: SemesterService;
  let leaguePlayerService: LeaguePlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SemesterScoreUpdateComponent],
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
      .overrideTemplate(SemesterScoreUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SemesterScoreUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    semesterScoreFormService = TestBed.inject(SemesterScoreFormService);
    semesterScoreService = TestBed.inject(SemesterScoreService);
    semesterService = TestBed.inject(SemesterService);
    leaguePlayerService = TestBed.inject(LeaguePlayerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Semester query and add missing value', () => {
      const semesterScore: ISemesterScore = { id: 456 };
      const semester: ISemester = { id: 53135 };
      semesterScore.semester = semester;

      const semesterCollection: ISemester[] = [{ id: 44791 }];
      jest.spyOn(semesterService, 'query').mockReturnValue(of(new HttpResponse({ body: semesterCollection })));
      const additionalSemesters = [semester];
      const expectedCollection: ISemester[] = [...additionalSemesters, ...semesterCollection];
      jest.spyOn(semesterService, 'addSemesterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ semesterScore });
      comp.ngOnInit();

      expect(semesterService.query).toHaveBeenCalled();
      expect(semesterService.addSemesterToCollectionIfMissing).toHaveBeenCalledWith(
        semesterCollection,
        ...additionalSemesters.map(expect.objectContaining)
      );
      expect(comp.semestersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call LeaguePlayer query and add missing value', () => {
      const semesterScore: ISemesterScore = { id: 456 };
      const player: ILeaguePlayer = { id: 96614 };
      semesterScore.player = player;

      const leaguePlayerCollection: ILeaguePlayer[] = [{ id: 87149 }];
      jest.spyOn(leaguePlayerService, 'query').mockReturnValue(of(new HttpResponse({ body: leaguePlayerCollection })));
      const additionalLeaguePlayers = [player];
      const expectedCollection: ILeaguePlayer[] = [...additionalLeaguePlayers, ...leaguePlayerCollection];
      jest.spyOn(leaguePlayerService, 'addLeaguePlayerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ semesterScore });
      comp.ngOnInit();

      expect(leaguePlayerService.query).toHaveBeenCalled();
      expect(leaguePlayerService.addLeaguePlayerToCollectionIfMissing).toHaveBeenCalledWith(
        leaguePlayerCollection,
        ...additionalLeaguePlayers.map(expect.objectContaining)
      );
      expect(comp.leaguePlayersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const semesterScore: ISemesterScore = { id: 456 };
      const semester: ISemester = { id: 42854 };
      semesterScore.semester = semester;
      const player: ILeaguePlayer = { id: 35891 };
      semesterScore.player = player;

      activatedRoute.data = of({ semesterScore });
      comp.ngOnInit();

      expect(comp.semestersSharedCollection).toContain(semester);
      expect(comp.leaguePlayersSharedCollection).toContain(player);
      expect(comp.semesterScore).toEqual(semesterScore);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISemesterScore>>();
      const semesterScore = { id: 123 };
      jest.spyOn(semesterScoreFormService, 'getSemesterScore').mockReturnValue(semesterScore);
      jest.spyOn(semesterScoreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semesterScore });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: semesterScore }));
      saveSubject.complete();

      // THEN
      expect(semesterScoreFormService.getSemesterScore).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(semesterScoreService.update).toHaveBeenCalledWith(expect.objectContaining(semesterScore));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISemesterScore>>();
      const semesterScore = { id: 123 };
      jest.spyOn(semesterScoreFormService, 'getSemesterScore').mockReturnValue({ id: null });
      jest.spyOn(semesterScoreService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semesterScore: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: semesterScore }));
      saveSubject.complete();

      // THEN
      expect(semesterScoreFormService.getSemesterScore).toHaveBeenCalled();
      expect(semesterScoreService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISemesterScore>>();
      const semesterScore = { id: 123 };
      jest.spyOn(semesterScoreService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semesterScore });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(semesterScoreService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareSemester', () => {
      it('Should forward to semesterService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(semesterService, 'compareSemester');
        comp.compareSemester(entity, entity2);
        expect(semesterService.compareSemester).toHaveBeenCalledWith(entity, entity2);
      });
    });

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
