import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SemesterScoreDetailComponent } from './semester-score-detail.component';

describe('SemesterScore Management Detail Component', () => {
  let comp: SemesterScoreDetailComponent;
  let fixture: ComponentFixture<SemesterScoreDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SemesterScoreDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ semesterScore: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SemesterScoreDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SemesterScoreDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load semesterScore on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.semesterScore).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
