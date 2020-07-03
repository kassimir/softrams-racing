import {async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditComponent } from './edit.component';
import { EditService } from '../../services/edit.service';
import { ModalService } from '../../services/modal.service';

import { EditMock } from '../../mocks/edit.mock';
import { ModalMock } from '../../mocks/modal.mock';

describe('EditComponent', () => {
  let component: EditComponent;
  let fixture: ComponentFixture<EditComponent>;
  let editService: EditService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditComponent ],
      imports: [ BrowserAnimationsModule ],
      providers: [
        {provide: EditService, useClass: EditMock}
      ]
    })
    .compileComponents();

    editService = TestBed.get(EditService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should init', () => {

    it('should set initial values', () => {
      expect(component.showModal).toBe(false);
      expect(component.editing).toBe(false);
      expect(component.adding).toBe(false);
    });

    it('should subscribe to editing member and set value', () => {
      editService.editingMember.next(true);
      expect(component.editing).toBe(true);
      editService.editingMember.next(false);
      expect(component.editing).toBe(false);
    });

    it('should subscribe to adding member and set value', () => {
      editService.addingMember.next(true);
      expect(component.adding).toBe(true);
      editService.addingMember.next(false);
      expect(component.adding).toBe(false);
    });

    it('should subscribe to Modal Service and set value', () => {
      ModalService.state.next(ModalMock.mock);
      expect(component.showModal).toBe(true);
      ModalService.state.next({...ModalMock.mock, show: false});
      expect(component.showModal).toBe(false);
    });
  });

  it('should initiate editing member', (done) => {
    editService.editingMember.subscribe(em => {
      expect(em).toBe(true);
    });
    component.editMember();
    expect(component.editing).toBe(true);
    expect(component.editRow.getValue()).toBe(true);
    done();
  });

  it('should initiate save', (done) => {
    const gen = generator();
    component.saveRow.subscribe(s =>{
      if (gen.next().value === 1) {
        expect(s).toBe(false);
      } else {
        expect(s).toBe(true);
      }
    });
    component.saveMember();
    done();
  });

  it('should initiate delete', (done) => {
    const gen = generator();
    component.deleteRow.subscribe(s => {
      if (gen.next().value === 1) {
        expect(s).toBe(false);
      } else if (gen.next().value === 2) {
        expect(s).toBe(true);
      }
    });
    component.deleteMember();
    done();
  });

  it('should remove edit if "escape" is hit and modal is not showing', (done) => {
    component.editRow.subscribe(e => {
      expect(e).toBe(false);
    });
    component.showModal = false;
    component.editing = true;
    const evt = new KeyboardEvent('keyup', {key: 'Escape'});
    document.dispatchEvent(evt);
    done();
  });

  function* generator() {
    while(true) {
      yield 1;
      yield 2;
    }
  }
});
