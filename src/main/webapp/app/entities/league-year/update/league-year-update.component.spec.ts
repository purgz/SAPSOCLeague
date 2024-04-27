import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LeagueYearFormService } from './league-year-form.service';
import { LeagueYearService } from '../service/league-year.service';
import { ILeagueYear } from '../league-year.model';

import { LeagueYearUpdateComponent } from './league-year-update.component';

describe('LeagueYear Management Update Component', () => {
  let comp: LeagueYearUpdateComponent;
  let fixture: ComponentFixture<LeagueYearUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let leagueYearFormService: LeagueYearFormService;
  let leagueYearService: LeagueYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LeagueYearUpdateComponent],
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
      .overrideTemplate(LeagueYearUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LeagueYearUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    leagueYearFormService = TestBed.inject(LeagueYearFormService);
    leagueYearService = TestBed.inject(LeagueYearService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const leagueYear: ILeagueYear = { id: 456 };

      activatedRoute.data = of({ leagueYear });
      comp.ngOnInit();

      expect(comp.leagueYear).toEqual(leagueYear);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeagueYear>>();
      const leagueYear = { id: 123 };
      jest.spyOn(leagueYearFormService, 'getLeagueYear').mockReturnValue(leagueYear);
      jest.spyOn(leagueYearService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leagueYear });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leagueYear }));
      saveSubject.complete();

      // THEN
      expect(leagueYearFormService.getLeagueYear).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(leagueYearService.update).toHaveBeenCalledWith(expect.objectContaining(leagueYear));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeagueYear>>();
      const leagueYear = { id: 123 };
      jest.spyOn(leagueYearFormService, 'getLeagueYear').mockReturnValue({ id: null });
      jest.spyOn(leagueYearService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leagueYear: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: leagueYear }));
      saveSubject.complete();

      // THEN
      expect(leagueYearFormService.getLeagueYear).toHaveBeenCalled();
      expect(leagueYearService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ILeagueYear>>();
      const leagueYear = { id: 123 };
      jest.spyOn(leagueYearService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ leagueYear });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(leagueYearService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
