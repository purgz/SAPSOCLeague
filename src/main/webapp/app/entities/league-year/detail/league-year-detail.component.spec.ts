import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LeagueYearDetailComponent } from './league-year-detail.component';

describe('LeagueYear Management Detail Component', () => {
  let comp: LeagueYearDetailComponent;
  let fixture: ComponentFixture<LeagueYearDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeagueYearDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ leagueYear: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LeagueYearDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LeagueYearDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load leagueYear on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.leagueYear).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
