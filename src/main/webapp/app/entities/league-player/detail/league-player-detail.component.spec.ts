import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LeaguePlayerDetailComponent } from './league-player-detail.component';

describe('LeaguePlayer Management Detail Component', () => {
  let comp: LeaguePlayerDetailComponent;
  let fixture: ComponentFixture<LeaguePlayerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeaguePlayerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ leaguePlayer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LeaguePlayerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LeaguePlayerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load leaguePlayer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.leaguePlayer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
