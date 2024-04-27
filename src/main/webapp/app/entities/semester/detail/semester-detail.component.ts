import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ISemester } from '../semester.model';

@Component({
  selector: 'jhi-semester-detail',
  templateUrl: './semester-detail.component.html',
})
export class SemesterDetailComponent implements OnInit {
  semester: ISemester | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ semester }) => {
      this.semester = semester;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
