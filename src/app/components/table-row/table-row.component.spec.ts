import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableRowComponent } from './table-row.component';
import { EditComponent } from '../edit/edit.component';
import { EditService } from '../../services/edit.service';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EditMock } from '../../mocks/edit.mock';
import { ModalMock } from '../../mocks/modal.mock';
import { filter } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';
import { ToastMock } from '../../mocks/toast.mock';
import { Toast } from '../../models/toast';
import {ModalService} from '../../services/modal.service';
import {Member} from '../../models/member';

describe('TableRowComponent', () => {
  let component: TableRowComponent;
  let fixture: ComponentFixture<TableRowComponent>;
  let editService: EditService;
  let toastService: ToastService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableRowComponent, EditComponent ],
      imports: [ BrowserAnimationsModule, HttpClientTestingModule, FormsModule ],
      providers: [
        {provide: EditService, useClass: EditMock}
      ]
    })
    .compileComponents();

    editService = TestBed.get(EditService);
    toastService = TestBed.get(ToastService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableRowComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should init', (done) => {
    component.adding = false;
    editService.addingMember
      .subscribe(editing => {
        expect(editing).toBe(false);
      });
    fixture.detectChanges();
    done();
  });

  it('should toggle editing', (done) => {
    fixture.detectChanges();
    component.editing = false;
    component.editRow(true);
    expect(component.editing).toBe(true);
    component.editRow(false);
    expect(component.editing).toBe(false);
    done();
  });

  it('should tell Table Component to save', (done) => {
    fixture.detectChanges();
    component.validate = () => true;
    component.editing = true;
    component.member = ModalMock.mock.member;
    component.save
      .pipe(filter(s => !!s))
      .subscribe(save => {
        expect(save).toBe(ModalMock.mock.member);
    });
    component.saveRow(true);
    expect(component.editing).toBe(false);
    done();
  });

  it('should warn about invalid form entries when trying to save', (done) => {
    fixture.detectChanges();
    spyOn(ToastService.toast, 'next').and.callFake(toast => {
      expect(toast).toEqual(new Toast('Please correct errors', 'error'))
    });
    component.validate = () => false;
    component.saveRow(true);
    done();
  });

  it('should delete row', () => {
    fixture.detectChanges();
    spyOn(ModalService.state, 'next').and.returnValue(ModalMock.mock);
    component.member = ModalMock.mock.member;
    ModalService.state
      .pipe(filter(modal => !!modal.member.id && (modal.member instanceof Member)))
      .subscribe(modal => {
        expect(modal).toEqual({show: true, member: ModalMock.mock.member})
      });
    ModalService.state.next({...ModalMock.mock, show: true});
    component.deleteRow(true);
  });

  it('should tell Edit component save status', (done) => {
    fixture.detectChanges();
    editService.addingMember.subscribe(adding => {
      expect(adding).toBe(true);
    });
    editService.editingMember.subscribe(editing => {
      expect(editing).toBe(true);
    });
    component.saveStatus = true;
    done();
  })
});
