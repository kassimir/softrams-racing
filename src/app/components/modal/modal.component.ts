import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '../../services/modal.service';
import { Member } from '../../models/member';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Modal } from '../../models/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {

  @HostListener('document:keyup', ['$event'])
  // Close modal with Escape key
  onKeyUp(ev: KeyboardEvent) {
    if (ev.key === 'Escape') {
      ModalService.state.next({show: false, member: {...this.member}});
    }
  }
  // Close modal with click outside of modal
  @HostListener('document:click', ['$event'])
  onMouseClick(ev: MouseEvent) {
    if (ev.target instanceof HTMLDivElement && ev.target.classList.contains('my-modal')) {
      this.deny()
    }
  }

  public show: boolean = false;
  // This keeps track of the currently selected member for the Delete functionality
  // If I didn't need to send this code in as soon as possible, I would move this
  // out of here. It's a really weird place to keep track of this.
  public member: Member;

  private destroy$: Subject<boolean>;

  constructor() { }

  ngOnInit() {
    this.destroy$ = new Subject<boolean>();
    // Watch Modal state from the Modal Service
    ModalService.state
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged()
      )
      .subscribe( ({show, member}: Modal) => {
        this.show = show;
        this.member = member;
      })
   }

  ngOnDestroy() {
    this.destroy$.next(true);
  }

  public confirm(): void {
    ModalService.state.next({show: false, member: {...this.member}});
    ModalService.confirm.next(true);
  }

  public deny(): void {
    ModalService.state.next({show: false, member: {...this.member}});
    ModalService.confirm.next(false);
  }
}
