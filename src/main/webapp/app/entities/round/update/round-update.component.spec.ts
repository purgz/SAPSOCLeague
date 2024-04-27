import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { RoundFormService } from './round-form.service';
import { RoundService } from '../service/round.service';
import { IRound } from '../round.model';
import { IWeek } from 'app/entities/week/week.model';
import { WeekService } from 'app/entities/week/service/week.service';

import { RoundUpdateComponent } from './round-update.component';

describe('Round Management Update Component', () => {
  let comp: RoundUpdateComponent;
  let fixture: ComponentFixture<RoundUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let roundFormService: RoundFormService;
  let roundService: RoundService;
  let weekService: WeekService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [RoundUpdateComponent],
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
      .overrideTemplate(RoundUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(RoundUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    roundFormService = TestBed.inject(RoundFormService);
    roundService = TestBed.inject(RoundService);
    weekService = TestBed.inject(WeekService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Week query and add missing value', () => {
      const round: IRound = { id: 456 };
      const week: IWeek = { id: 61545 };
      round.week = week;

      const weekCollection: IWeek[] = [{ id: 11582 }];
      jest.spyOn(weekService, 'query').mockReturnValue(of(new HttpResponse({ body: weekCollection })));
      const additionalWeeks = [week];
      const expectedCollection: IWeek[] = [...additionalWeeks, ...weekCollection];
      jest.spyOn(weekService, 'addWeekToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ round });
      comp.ngOnInit();

      expect(weekService.query).toHaveBeenCalled();
      expect(weekService.addWeekToCollectionIfMissing).toHaveBeenCalledWith(
        weekCollection,
        ...additionalWeeks.map(expect.objectContaining)
      );
      expect(comp.weeksSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const round: IRound = { id: 456 };
      const week: IWeek = { id: 29129 };
      round.week = week;

      activatedRoute.data = of({ round });
      comp.ngOnInit();

      expect(comp.weeksSharedCollection).toContain(week);
      expect(comp.round).toEqual(round);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRound>>();
      const round = { id: 123 };
      jest.spyOn(roundFormService, 'getRound').mockReturnValue(round);
      jest.spyOn(roundService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ round });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: round }));
      saveSubject.complete();

      // THEN
      expect(roundFormService.getRound).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(roundService.update).toHaveBeenCalledWith(expect.objectContaining(round));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRound>>();
      const round = { id: 123 };
      jest.spyOn(roundFormService, 'getRound').mockReturnValue({ id: null });
      jest.spyOn(roundService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ round: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: round }));
      saveSubject.complete();

      // THEN
      expect(roundFormService.getRound).toHaveBeenCalled();
      expect(roundService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IRound>>();
      const round = { id: 123 };
      jest.spyOn(roundService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ round });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(roundService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareWeek', () => {
      it('Should forward to weekService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(weekService, 'compareWeek');
        comp.compareWeek(entity, entity2);
        expect(weekService.compareWeek).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
