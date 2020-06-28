import {Component, Input, OnInit} from '@angular/core';
import {Member} from '../../models/member';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'tr[table-row]',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css'],
  animations: [
    trigger('editing', [
      state('enabled', style({
        transform: 'translateX(-75px)',
        display: 'none'
      })),
      state('disabled', style({
        transform: 'none',
        display: 'inline-block'
      })),
      transition('* => disabled', [animate('0.25s')]),
      transition('* => enabled', [animate('0.25s')])
    ])
  ]
})
export class TableRowComponent implements OnInit {

  @Input()
    member: Member;

  public editing: boolean;

  constructor() { }

  ngOnInit() {
    if (!this.member) this.editing = true;
  }

  public editMember(): void {
    this.editing = !this.editing;
  }

}
