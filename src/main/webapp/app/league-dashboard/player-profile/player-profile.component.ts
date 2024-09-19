import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { accountState } from '../../account/account.route';
import { LeaguePlayerService } from '../../entities/league-player/service/league-player.service';
import { ILeaguePlayer } from '../../entities/league-player/league-player.model';
import { HttpStatusCode } from '@angular/common/http';
import { error } from '@angular/compiler-cli/src/transformers/util';

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

  public leaguePlayer: ILeaguePlayer | null = null;

  constructor(private activatedRoute: ActivatedRoute, private leaguePlayerService: LeaguePlayerService) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(value => {
      this.profileId = value['profile-id'];
      if (this.profileId != null) {
        this.leaguePlayerService.find(this.profileId).subscribe(
          value => {
            if (value.status == HttpStatusCode.Ok) {
              this.leaguePlayer = value.body;
            }
          },
          error => {
            alert('Player not found how did you get here?');
            console.log(error);
          }
        );
      }
    });
  }
}
