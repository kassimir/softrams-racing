import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

import { HttpClient } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http';
import {Form, FormBuilder, FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { RouterMock } from '../../mocks/router.mock';
import { AuthService } from '../../auth/auth.service';
import { AuthMock } from '../../mocks/auth.mock';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let auth: AuthService;
  let router: Router;
  let fb: FormBuilder;
  let getEle;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, RouterModule, HttpClientModule],
      providers: [
        {provide: Router, useClass: RouterMock},
        {provide: AuthService, useClass: AuthMock},
        FormBuilder,
        HttpClient
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    auth = TestBed.get(AuthService);
    router = TestBed.get(Router);
    fb = TestBed.get(FormBuilder);
    fixture.detectChanges();

    getEle = (selector) => fixture.debugElement.query(By.css(selector));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should init', () => {
    it('should reroute logged in users', () => {
      spyOn(router, 'navigate').and.callThrough();
      auth.setUser('MockUser', false);
      component.ngOnInit();
      expect(router.navigate).toHaveBeenCalledWith(['/members'])
    });

    it('should create form', () => {
      expect(component.loginForm).toBeTruthy();
      expect(component.loginForm.get('username')).toBeTruthy();
      expect(component.loginForm.get('password')).toBeTruthy();
      expect(component.loginForm.get('remember')).toBeTruthy();
    })
  });

  it('should set focused input based on input focus', () => {
    component.focusedInput = 'password';
    const usernameInput = getEle('#username');
    const passwordInput = getEle('#password');
    usernameInput.triggerEventHandler('focus', null);
    expect(component.focusedInput).toBe('username')
    passwordInput.triggerEventHandler('focus', null);
    expect(component.focusedInput).toBe('password')
  });

  it('should set remember value when Remember Me is checked', () => {
    expect(component.rememberMe).toBe(false);
    const rememberCheck = getEle('input[type="checkbox"]').nativeElement;
    rememberCheck.click();
    expect(component.rememberMe).toBe(true);
  })

  it('should log in', () => {
    component.loginForm.get('username').setValue('MockUser');
    expect(component.rememberMe).toBe(false);
    component.login();
    expect(auth.getUser()).toBe('MockUser');
  })
});
