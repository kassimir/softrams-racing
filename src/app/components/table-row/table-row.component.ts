import { Component, Input, OnInit, Output } from '@angular/core';
import { Member } from '../../models/member';
import { EditService } from '../../services/edit.service';
import { ModalService } from '../../services/modal.service';
import { Team } from '../../models/team';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../models/toast';

@Component({
  selector: 'tr[table-row]',
  templateUrl: './table-row.component.html',
  styleUrls: ['./table-row.component.css'],
  providers: [EditService],
})
export class TableRowComponent implements OnInit {

  @Input() // Member for this row
    member: Member;
  @Input() // Whether or not it is a newly-added member
    adding: boolean;
  @Input() // List of teams for drop-down
    teams: Team[];
  @Input() // Table Component saves, and that trickles down through here and into Edit Component
    set saveStatus(status: boolean) {
      if (status) {
        this.editService.editingMember.next(false);
        this.editService.addingMember.next(false);
      }
    }
  @Output() // Lets Table Component know to save
    save = new BehaviorSubject<Member>(null);

  // Whether or not it's editing time
  public editing: boolean;

  constructor(private editService: EditService) { }

  ngOnInit() {
    this.editService.addingMember.next(this.adding);
  }

  public editRow(editing: boolean): void {
    this.editing = editing;
  }

  public saveRow(saving: boolean): void {
    if (saving && this.validate()) {
      this.editing = false;
      this.save.next(this.member);
    } else if (saving && !this.validate()) {
      ToastService.toast.next(new Toast('Please correct errors', 'error'))
    }
  }

  public deleteRow(deleting: boolean): void {
    if (deleting) {
      ModalService.state.next({show: true, member: this.member});
    }
  }

  // Check to ensure all fields are valid. My original intent was to have specific
  // error messages and field highlights for this, but I simply ran out of time
  public validate(): boolean {
    if (typeof this.member.id === 'string') {
      this.member.id = +this.member.id;
    }
    return !!this.member.firstName.match(/^(?=.*[A-Z|a-z])[A-Z|a-z]{2,}$/)
        && !!this.member.lastName.match(/^(?=.*[A-Z|a-z])[A-Z|a-z]{2,}$/)
        && !!this.member.jobTitle.match(/^(?=.*[A-Z|a-z])[A-Z|a-z]{2,}$/)
  }
}
