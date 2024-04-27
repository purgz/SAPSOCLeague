import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { WeekFormService } from './week-form.service';
import { WeekService } from '../service/week.service';
import { IWeek } from '../week.model';
import { ISemester } from 'app/entities/semester/semester.model';
import { SemesterService } from 'app/entities/semester/service/semester.service';

import { WeekUpdateComponent } from './week-update.component';

describe('Week Management Update Component', () => {
  let comp: WeekUpdateComponent;
  let fixture: ComponentFixture<WeekUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let weekFormService: WeekFormService;
  let weekService: WeekService;
  let semesterService: SemesterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [WeekUpdateComponent],
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
      .overrideTemplate(WeekUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(WeekUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    weekFormService = TestBed.inject(WeekFormService);
    weekService = TestBed.inject(WeekService);
    semesterService = TestBed.inject(SemesterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Semester query and add missing value', () => {
      const week: IWeek = { id: 456 };
      const semester: ISemester = { id: 66640 };
      week.semester = semester;

      const semesterCollection: ISemester[] = [{ id: 71060 }];
      jest.spyOn(semesterService, 'query').mockReturnValue(of(new HttpResponse({ body: semesterCollection })));
      const additionalSemesters = [semester];
      const expectedCollection: ISemester[] = [...additionalSemesters, ...semesterCollection];
      jest.spyOn(semesterService, 'addSemesterToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ week });
      comp.ngOnInit();

      expect(semesterService.query).toHaveBeenCalled();
      expect(semesterService.addSemesterToCollectionIfMissing).toHaveBeenCalledWith(
        semesterCollection,
        ...additionalSemesters.map(expect.objectContaining)
      );
      expect(comp.semestersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const week: IWeek = { id: 456 };
      const semester: ISemester = { id: 42098 };
      week.semester = semester;

      activatedRoute.data = of({ week });
      comp.ngOnInit();

      expect(comp.semestersSharedCollection).toContain(semester);
      expect(comp.week).toEqual(week);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeek>>();
      const week = { id: 123 };
      jest.spyOn(weekFormService, 'getWeek').mockReturnValue(week);
      jest.spyOn(weekService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ week });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: week }));
      saveSubject.complete();

      // THEN
      expect(weekFormService.getWeek).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(weekService.update).toHaveBeenCalledWith(expect.objectContaining(week));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeek>>();
      const week = { id: 123 };
      jest.spyOn(weekFormService, 'getWeek').mockReturnValue({ id: null });
      jest.spyOn(weekService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ week: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: week }));
      saveSubject.complete();

      // THEN
      expect(weekFormService.getWeek).toHaveBeenCalled();
      expect(weekService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IWeek>>();
      const week = { id: 123 };
      jest.spyOn(weekService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ week });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(weekService.update).toHaveBeenCalled();
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
