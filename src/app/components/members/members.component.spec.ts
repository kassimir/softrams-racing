import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule } from '@angular/router';

import { MembersComponent } from './members.component';

import { Router } from '@angular/router';
import { TableComponent } from '../table/table.component';
import { ToastComponent } from '../toast/toast.component';
import { TableRowComponent } from '../table-row/table-row.component';
import { ModalComponent } from '../modal/modal.component';
import { EditComponent } from '../edit/edit.component';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditService } from '../../services/edit.service';


describe('MembersComponent', () => {
  let component: MembersComponent;
  let fixture: ComponentFixture<MembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        MembersComponent,
        TableComponent,
        ToastComponent,
        TableRowComponent,
        ModalComponent,
        EditComponent
      ],
      imports: [BrowserAnimationsModule, FormsModule, HttpClientTestingModule, RouterModule],
      providers: [
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }, EditService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
