import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComponent } from './table.component';
import { EditComponent } from '../edit/edit.component';
import { TableRowComponent } from '../table-row/table-row.component';
import { ModalComponent } from '../modal/modal.component';
import { EditService } from '../../services/edit.service';
import { EditMock } from '../../mocks/edit.mock';
import { AppService } from '../../services/app.service';
import { AppMock } from '../../mocks/app.mock';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalMock } from '../../mocks/modal.mock';
import { zip } from 'rxjs';
import { ModalService } from '../../services/modal.service';
import { filter } from 'rxjs/operators';
import { Member } from '../../models/member';
import { ToastService } from '../../services/toast.service';
import { Toast } from '../../models/toast';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableComponent,
        TableRowComponent,
        EditComponent,
        ModalComponent
      ],
      imports: [BrowserAnimationsModule, HttpClientTestingModule, FormsModule],
      providers: [
        {provide: EditService, useClass: EditMock},
        {provide: AppService, useClass: AppMock}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should init', () => {
    it('should set initial values', () => {
      const headers = [
        'Member ID',
        'First Name',
        'Last Name',
        'Job Title',
        'Racing Team',
        'Status'
      ];
      expect(component.members).toEqual([ModalMock.mock.member]);
      expect(component.adding).toBe(false);
      expect(component.showModal).toBe(false);
      expect(component.headers).toEqual(headers);
    });

    it('should set up modal subscriptions', (done) => {
      spyOn(ModalService.state, 'next').and.returnValue(ModalMock.mock);
      zip(
        ModalService.state,
        ModalService.confirm
      )
        .pipe(filter(([modalState, _]) => !!modalState.member.id && (modalState.member instanceof Member)))
        .subscribe( ([modalState, modalConfirm]) => {
          expect(modalState).toEqual(ModalMock.mock);
          expect(modalConfirm).toBe(true);
        });

      ModalService.state.next(null);
      done();
    })
  });

  it('should add member row', () => {
    component.members = [];
    component.adding = false;
    component.addMemberRow();
    expect(component.members).toEqual([new Member(null, '', '', '', '', '')])
  });

  it('should cancel add member', () => {
    component.members = [new Member(null, '', '', '', '', '')];
    component.adding = true;
    component.addMemberRow()
    expect(component.members).toEqual([]);
  });

  it('should return if trying to save blank member', () => {
    expect(component.saveMember(null)).toBeFalsy();
  });

  it('should save new valid member', () => {
    spyOn(ToastService.toast, 'next').and.returnValue({});
    component.adding = true;
    component.saveMember(ModalMock.mock.member);
    expect(component.adding).toBe(false);
    expect(ToastService.toast.next).toHaveBeenCalledWith(new Toast(`Mock User Saved Successfully!`, 'success'))
    expect(component.saveStatus).toBe(true);
  });

  it('should save edited valid member', () => {
    spyOn(ToastService.toast, 'next').and.returnValue({});
    component.adding = false;
    component.saveMember(ModalMock.mock.member);
    expect(component.adding).toBe(false);
    expect(ToastService.toast.next).toHaveBeenCalledWith(new Toast(`Mock User Saved Successfully!`, 'success'))
    expect(component.saveStatus).toBe(true);
  });

  it('should throw error for trying to save member with id already taken', () => {
    spyOn(ToastService.toast, 'next').and.returnValue({});
    component.adding = true;
    component.members = [ModalMock.mock.member, ModalMock.mock.member];
    component.saveMember(ModalMock.mock.member);
    expect(ToastService.toast.next).toHaveBeenCalledWith(new Toast('That member id is taken.', 'error'))
  });

});
