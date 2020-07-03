import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { Toast } from '../../models/toast';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit, OnDestroy {

  public toaster: Toast;
  public toastClass: string;

  private destroy$: Subject<boolean>;

  constructor() { }

  ngOnInit() {
    this.destroy$ = new Subject<boolean>();
    this.toastClass = 'hide';
    ToastService.toast
      .pipe(
        takeUntil(this.destroy$),
        filter(this.valid),
        distinctUntilChanged(),
      )
      .subscribe( (t: Toast) => {
        this.toaster = t;
        this.toastClass = 'show';
        setTimeout(() => {
          console.log('foir')
          this.toastClass = 'hide';
          ToastService.toast.next(null)
        }, 2000)
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  public getClasses(): string | string[] {
    return this.toaster && this.toaster.type
      ? [this.toaster.type, this.toastClass]
      : this.toastClass
  }

  private valid(tst: Toast): boolean {
    return !!(tst && tst instanceof Toast && tst.msg && tst.type);
  }

}
