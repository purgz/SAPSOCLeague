import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { SemesterDetailComponent } from './semester-detail.component';

describe('Semester Management Detail Component', () => {
  let comp: SemesterDetailComponent;
  let fixture: ComponentFixture<SemesterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SemesterDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ semester: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(SemesterDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(SemesterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load semester on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.semester).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
