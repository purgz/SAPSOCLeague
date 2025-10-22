import { Injectable } from '@angular/core';
import { WeekService } from '../../entities/week/service/week.service';
import { WeekExtended } from './week-extended.model';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class HistoryService {
  constructor(private weekService: WeekService) {}

  public semId: number | null = null;

  public weeks: WeekExtended[] | null = null;

  setWeeks(semId: number): void {
    this.weekService.getBySemId(semId).subscribe(value => {
      this.weeks = value.body;
    });
  }
}
