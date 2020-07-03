import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../services/app.service';
import { Member } from '../../models/member';
import { trigger, state, style, animate, transition, query } from '@angular/animations';
import { ModalService } from '../../services/modal.service';
import { Team } from '../../models/team';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Modal } from '../../models/modal';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../models/toast';
import { Subject } from 'rxjs';

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
    trigger('enterani', [
      transition(':enter', [
        query('.fa-save, .fa-trash', [
           style({display: 'none'})
        ]),
        query('.fas, input, select, p', [
          style({ transform: 'translateY(-100%)' }),
          animate('0.25s', style({ transform: 'translateY(0)' }))
        ]),
      ])
    ])
  ]
})
export class TableComponent implements OnInit, OnDestroy {

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      if (this.adding) {
        this.addMemberRow();
      }
    }
  }

  // List of members
  public members: Member[];
  // List of teams
  public teams: Team[];
  // Table headers
  public headers: string[];
  // Adding new member
  public adding: boolean;
  // Is modal showing
  public showModal: boolean;
  // Status of saving new member
  public saveStatus: boolean;
  // Currently-selected member id (for saving/deleting)
  private memberId: number;

  private destroy$: Subject<boolean>;

  constructor(private appService: AppService) { }

  ngOnInit() {
    this.destroy$ = new Subject<boolean>();
    this.getMembers();
    this.appService.getTeams()
      .subscribe(teams => this.teams = teams);
    this.adding = false;
    this.showModal = false;
    this.headers = [
      'Member ID',
      'First Name',
      'Last Name',
      'Job Title',
      'Racing Team',
      'Status'
    ];

    ModalService.state
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe( ({show, member}: Modal) => {
        this.showModal = show;
        this.memberId = member.id;
      });

    ModalService.confirm
        .pipe(
          takeUntil(this.destroy$),
          filter((confirm: boolean) => confirm)
        )
        .subscribe(_ => {
          this.appService.deleteMember(this.memberId)
            .subscribe(() => {
              ToastService.toast.next(new Toast('Member Deleted!', 'success'));
              this.appService.getMembers()
                  .subscribe(() => this.getMembers())
            })
        })
  }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  // This creates/removes a blank row for creating a new member
  public addMemberRow(): void {
    this.adding = !this.adding;
    if (this.adding) {
      this.members.unshift(new Member(null, '', '', '', '', ''));
    } else {
      this.members.shift();
    }
  }

  public saveMember(evt: Member): void {
    if (!evt) {
      return
    }

    // Adding new member, check for unique member id
    if (this.adding && this.verifyUnique(evt)) {
      this.saveMemberFunction(evt);
    // Not adding, just editing - can't change member id
    } else if (!this.adding) {
      this.saveMemberFunction(evt)
    // Adding new member, but member id is taken
    } else {
      ToastService.toast.next(new Toast('That member id is taken.', 'error'))
    }

    if (this.adding) {
      this.adding = false;
    }
  }

  // Function for saving new/edited members
  private saveMemberFunction(evt: Member): void {
    this.appService.addMember(evt)
      .subscribe(() => {
        ToastService.toast.next(new Toast(`${evt.firstName} ${evt.lastName} Saved Successfully!`, 'success'));
        this.adding = false;
        this.saveStatus = true;
        this.getMembers()
      });
  }

  // Return all members
  private getMembers(): void {
    this.appService.getMembers()
        .pipe(distinctUntilChanged())
        .subscribe(members => this.members = members);
  }

  // Check to ensure an added member has its own unique id
  private verifyUnique(evt: Member): boolean {
    return this.members.every( (member, ind) => {
      if (!ind) {
        return true;
      }

      return member.id !== evt.id;
    })
  }
}
