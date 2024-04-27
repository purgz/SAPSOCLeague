import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { WeekDetailComponent } from './week-detail.component';

describe('Week Management Detail Component', () => {
  let comp: WeekDetailComponent;
  let fixture: ComponentFixture<WeekDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeekDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ week: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(WeekDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(WeekDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load week on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.week).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
