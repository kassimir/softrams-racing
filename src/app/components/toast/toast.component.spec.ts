import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastComponent } from './toast.component';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../models/toast';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    const mockToast = new Toast('Mock Toast', 'success');

    expect(component.toastClass).toBe('hide');
    ToastService.toast.next(mockToast);
    expect(component.toaster).toEqual(mockToast);
    expect(component.toastClass).toBe('show')
  });
});
