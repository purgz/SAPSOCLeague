import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { accountState } from '../../account/account.route';

@Component({
  selector: 'player-profile',
  templateUrl: './player-profile.component.html',
})
export class PlayerProfileComponent implements OnInit {
  //todo
  /*
  add links on player buttons to their profile page
  get profile info and display on their page
  work out win percentage and also display
   */

  public profileId: number | null = null;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    console.log('ACTIVATED ROUTE');

    this.activatedRoute.params.subscribe(value => {
      console.log(value['profile-id']);
      this.profileId = value['profile-id'];
    });
  }
}
