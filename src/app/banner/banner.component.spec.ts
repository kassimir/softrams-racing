import {async, ComponentFixture, inject, TestBed} from '@angular/core/testing';

import { BannerComponent } from './banner.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth/auth.service';
import { AuthMock } from '../mocks/auth.mock';
import { Router } from '@angular/router';
import { RouterMock } from '../mocks/router.mock';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;
  let auth: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerComponent ],
      providers: [
        {provide: AuthService, useClass: AuthMock},
        {provide: Router, useClass: RouterMock}
      ],
      imports: [ HttpClientTestingModule, RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(inject([AuthService, Router], (as: AuthService, r: Router) => {
    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    auth = as;
    router = r;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log out', () => {
    spyOn(auth, 'killUser').and.callFake(() => {});
    component.logout();
    expect(auth.killUser).toHaveBeenCalled();
  })
});
