import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Router } from '@angular/router';
import { Member } from '../../models/member';

@Component({
  selector: 'app-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css']
})
export class MembersComponent implements OnInit {
  public addMemberState = false;
  public members: Member[] = [];

  constructor(public appService: AppService, private router: Router) {}

  ngOnInit() {
  }

  public toggleAdd(): void {
    this.addMemberState = !this.addMemberState;
  }
}
