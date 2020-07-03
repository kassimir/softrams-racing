import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';
import { ModalService } from '../../services/modal.service';
import { ModalMock } from '../../mocks/modal.mock';
import { filter } from 'rxjs/operators';
import { Member } from '../../models/member';
import { zip } from 'rxjs';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent ],
      providers: [
        {provide: ModalService, useClass: ModalMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init', () => {
    ModalService.state.next(ModalMock.mock);
    expect(component.show).toBe(true);
    expect(component.member).toEqual(ModalMock.mock.member);
  });

  it('should confirm', (done) => {
    const gen = generator();
    zip(
      ModalService.state,
      ModalService.confirm
    )
      .pipe(filter(([modalState, _]) => !!modalState.member.id))
      .subscribe( ([modalState, modalConfirm]) => {
        if (gen.next().value === 1) {
          expect(modalState).toEqual(ModalMock.mock);
          expect(modalConfirm).toBe(false);
        } else if (gen.next().value === 2) {
          expect(modalState).toEqual({...ModalMock.mock, show: false});
          expect(modalConfirm).toBe(true);
        }
      });
    component.confirm();
    done();
  });

  it('should deny', (done) => {
    zip(
      ModalService.state,
      ModalService.confirm
    )
      .pipe(filter(([modalState, _]) => !!modalState.member.id && (modalState.member instanceof Member)))
      .subscribe( ([modalState, modalConfirm]) => {
        expect(modalState).toEqual(ModalMock.mock);
        expect(modalConfirm).toBe(false);
      });

    ModalService.state.next(ModalMock.mock);
    component.deny();
    done();
  });

  it('should close modal on escape', (done) => {
    ModalService.state
      .pipe(filter(modal => !!modal.member.id && (modal.member instanceof Member)))
      .subscribe(modalState => {
        expect(modalState).toEqual({...ModalMock.mock, show: false})
      });
    component.member = ModalMock.mock.member;
    const evt = new KeyboardEvent('keyup', {key: 'Escape'});
    document.dispatchEvent(evt);
    done();
  });

  function* generator() {
    while (true) {
      yield 1;
      yield 2;
    }
  }
});
