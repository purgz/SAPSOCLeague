import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { GameResultDetailComponent } from './game-result-detail.component';

describe('GameResult Management Detail Component', () => {
  let comp: GameResultDetailComponent;
  let fixture: ComponentFixture<GameResultDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameResultDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ gameResult: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(GameResultDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(GameResultDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load gameResult on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.gameResult).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
