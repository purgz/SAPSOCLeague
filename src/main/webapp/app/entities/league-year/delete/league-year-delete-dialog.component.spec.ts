jest.mock('@ng-bootstrap/ng-bootstrap');

import { ComponentFixture, TestBed, inject, fakeAsync, tick } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { LeagueYearService } from '../service/league-year.service';

import { LeagueYearDeleteDialogComponent } from './league-year-delete-dialog.component';

describe('LeagueYear Management Delete Component', () => {
  let comp: LeagueYearDeleteDialogComponent;
  let fixture: ComponentFixture<LeagueYearDeleteDialogComponent>;
  let service: LeagueYearService;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LeagueYearDeleteDialogComponent],
      providers: [NgbActiveModal],
    })
      .overrideTemplate(LeagueYearDeleteDialogComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LeagueYearDeleteDialogComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LeagueYearService);
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('confirmDelete', () => {
    it('Should call delete service on confirmDelete', inject(
      [],
      fakeAsync(() => {
        // GIVEN
        jest.spyOn(service, 'delete').mockReturnValue(of(new HttpResponse({ body: {} })));

        // WHEN
        comp.confirmDelete(123);
        tick();

        // THEN
        expect(service.delete).toHaveBeenCalledWith(123);
        expect(mockActiveModal.close).toHaveBeenCalledWith('deleted');
      })
    ));

    it('Should not call delete service on clear', () => {
      // GIVEN
      jest.spyOn(service, 'delete');

      // WHEN
      comp.cancel();

      // THEN
      expect(service.delete).not.toHaveBeenCalled();
      expect(mockActiveModal.close).not.toHaveBeenCalled();
      expect(mockActiveModal.dismiss).toHaveBeenCalled();
    });
  });
});
