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
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';

import { LeaguePlayerUpdateComponent } from './league-player-update.component';

describe('LeaguePlayer Management Update Component', () => {
  let comp: LeaguePlayerUpdateComponent;
  let fixture: ComponentFixture<LeaguePlayerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leaguePlayerFormService: LeaguePlayerFormService;
  let leaguePlayerService: LeaguePlayerService;
  let semesterService: SemesterService;

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
    semesterService = TestBed.inject(SemesterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Semester query and add missing value', () => {
      const leaguePlayer: ILeaguePlayer = { id: 456 };
      const semester: ISemester = { id: 15445 };
      leaguePlayer.semester = semester;

      const semesterCollection: ISemester[] = [{ id: 77966 }];
      jest.spyOn(semesterService, 'query').mockReturnValue(of(new HttpResponse({ body: semesterCollection })));
      const additionalSemesters = [semester];
      const expectedCollection: ISemester[] = [...additionalSemesters, ...semesterCollection];
      jest.spyOn(semesterService, 'addSemesterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ leaguePlayer });
      comp.ngOnInit();

      expect(semesterService.query).toHaveBeenCalled();
      expect(semesterService.addSemesterToCollectionIfMissing).toHaveBeenCalledWith(
        semesterCollection,
        ...additionalSemesters.map(expect.objectContaining)
      );
      expect(comp.semestersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const leaguePlayer: ILeaguePlayer = { id: 456 };
      const semester: ISemester = { id: 204 };
      leaguePlayer.semester = semester;

      activatedRoute.data = of({ leaguePlayer });
      comp.ngOnInit();

      expect(comp.semestersSharedCollection).toContain(semester);
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
  });
});
