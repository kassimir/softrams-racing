import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { Member } from '../../models/member';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('addMemToggle', [
      state('adding', style({
        transform: 'rotate(45deg)',
        color: 'red'
      })),
      state('notAdding', style({
        transform: 'none',
        color: 'blue'
      })),
      transition('adding => notAdding', [animate('0.25s')]),
      transition('notAdding => adding', [animate('0.25s')])
    ]),
    trigger('enterLeave', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('1s', style({ transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('1s', style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class TableComponent implements OnInit {

  public members: Member[];
  public headers: string[];
  public adding: boolean;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.appService.getMembers().subscribe(members => this.members = members);
    this.adding = false;
    this.headers = [
      'Member ID',
      'First Name',
      'Last Name',
      'Job Title',
      'Racing Team',
      'Status'
    ];
  }

  public addMember(): void {
    this.adding = !this.adding;
    if (this.adding) {
      this.members.unshift(null);
    } else {
      this.members.shift();
    }
  }
}
