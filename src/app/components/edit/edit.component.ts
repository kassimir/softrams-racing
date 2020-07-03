import { Component, HostListener, OnInit, OnDestroy, Output } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EditService } from '../../services/edit.service';
import { BehaviorSubject, Subject } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { distinctUntilChanged, pluck, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  animations: [
    trigger('editButton', [
      state('edit', style({
        transform: 'translateY(-75px)',
        height: 0
      })),
      state('noedit', style({
        transform: 'none',
        height: 'auto'
      })),
      transition('* => noedit', [animate('0.25s')]),
      transition('* => edit', [animate('0.25s')])
    ]),
    trigger('updateDiv', [
      state('update', style({
        transform: 'translateY(75px)',
        height: 0
      })),
      state('noupdate', style({
        transform: 'none',
        height: 'auto'
      })),
      transition('* => noupdate', [animate('0.25s')]),
      transition('* => update', [animate('0.25s')])
    ])
  ]
})
export class EditComponent implements OnInit, OnDestroy {

  // adding a new member
  public adding: boolean;
  // editing a member
  public editing: boolean;
  // used for `escape` listener on document
  public showModal: boolean;

  private destroy$: Subject<boolean>;

  @Output() // tells table row component when edit button is clicked
    editRow = new BehaviorSubject<boolean>(false);
  @Output() // tells table row component when save button is clicked
    saveRow = new BehaviorSubject<boolean>(false);
  @Output() // tells table row component when delete button is clicked
    deleteRow = new BehaviorSubject<boolean>(false);

  // Escaping will revert editing
  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.key === 'Escape' && !this.showModal) {
      this.editRow.next(false);
      this.editing = false;
    }
  }

  constructor(private editService: EditService) { }

  ngOnInit() {
    // Subject for ending subs on destroy
    this.destroy$ = new Subject<boolean>();

    // Initialize values
    this.editing = false;
    this.adding = false;
    this.showModal = false;

    // Communication for editing with table row
    this.editService.editingMember
      .pipe(takeUntil(this.destroy$))
      .subscribe((editing: boolean) => {
        this.editing = editing
      });

    // Communication for adding member with table row
    this.editService.addingMember
      .pipe(takeUntil(this.destroy$))
      .subscribe((adding: boolean) => {
        this.adding = adding;
        if (this.adding) {
          this.editMember();
        }
      });

    // Watch modal state
    ModalService.state
      .pipe(
        takeUntil(this.destroy$),
        pluck('show'),
        distinctUntilChanged(),
      )
      .subscribe((show: boolean) => {
        this.showModal = show;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  // I believe these functions are self-explanatory
  public editMember(): void {
    this.editing = !this.editing;
    this.editService.editingMember.next(this.editing);
    this.editRow.next(this.editing);
  }

  public saveMember(): void {
    this.saveRow.next(true);
  }

  public deleteMember(): void {
    this.deleteRow.next(true);
  }
}
