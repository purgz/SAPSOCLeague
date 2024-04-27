import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { SemesterFormService } from './semester-form.service';
import { SemesterService } from '../service/semester.service';
import { ISemester } from '../semester.model';
import { ILeagueYear } from 'app/entities/league-year/league-year.model';
import { LeagueYearService } from 'app/entities/league-year/service/league-year.service';

import { SemesterUpdateComponent } from './semester-update.component';

describe('Semester Management Update Component', () => {
  let comp: SemesterUpdateComponent;
  let fixture: ComponentFixture<SemesterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let semesterFormService: SemesterFormService;
  let semesterService: SemesterService;
  let leagueYearService: LeagueYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [SemesterUpdateComponent],
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
      .overrideTemplate(SemesterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(SemesterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    semesterFormService = TestBed.inject(SemesterFormService);
    semesterService = TestBed.inject(SemesterService);
    leagueYearService = TestBed.inject(LeagueYearService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call LeagueYear query and add missing value', () => {
      const semester: ISemester = { id: 456 };
      const year: ILeagueYear = { id: 73697 };
      semester.year = year;

      const leagueYearCollection: ILeagueYear[] = [{ id: 36069 }];
      jest.spyOn(leagueYearService, 'query').mockReturnValue(of(new HttpResponse({ body: leagueYearCollection })));
      const additionalLeagueYears = [year];
      const expectedCollection: ILeagueYear[] = [...additionalLeagueYears, ...leagueYearCollection];
      jest.spyOn(leagueYearService, 'addLeagueYearToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ semester });
      comp.ngOnInit();

      expect(leagueYearService.query).toHaveBeenCalled();
      expect(leagueYearService.addLeagueYearToCollectionIfMissing).toHaveBeenCalledWith(
        leagueYearCollection,
        ...additionalLeagueYears.map(expect.objectContaining)
      );
      expect(comp.leagueYearsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const semester: ISemester = { id: 456 };
      const year: ILeagueYear = { id: 5047 };
      semester.year = year;

      activatedRoute.data = of({ semester });
      comp.ngOnInit();

      expect(comp.leagueYearsSharedCollection).toContain(year);
      expect(comp.semester).toEqual(semester);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISemester>>();
      const semester = { id: 123 };
      jest.spyOn(semesterFormService, 'getSemester').mockReturnValue(semester);
      jest.spyOn(semesterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semester });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: semester }));
      saveSubject.complete();

      // THEN
      expect(semesterFormService.getSemester).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(semesterService.update).toHaveBeenCalledWith(expect.objectContaining(semester));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISemester>>();
      const semester = { id: 123 };
      jest.spyOn(semesterFormService, 'getSemester').mockReturnValue({ id: null });
      jest.spyOn(semesterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semester: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: semester }));
      saveSubject.complete();

      // THEN
      expect(semesterFormService.getSemester).toHaveBeenCalled();
      expect(semesterService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ISemester>>();
      const semester = { id: 123 };
      jest.spyOn(semesterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ semester });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(semesterService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareLeagueYear', () => {
      it('Should forward to leagueYearService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(leagueYearService, 'compareLeagueYear');
        comp.compareLeagueYear(entity, entity2);
        expect(leagueYearService.compareLeagueYear).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
