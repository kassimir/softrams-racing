import { TestBed, inject } from '@angular/core/testing';

import { AuthGuard } from './authguard.service';
import { AuthService } from './auth.service';

import { AuthMock } from '../mocks/auth.mock';

describe('AppService', () => {

  let service: AuthGuard;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthGuard,
        {provide: AuthService, useClass: AuthMock}],
      imports: []
    });

    service = TestBed.get(AuthGuard);
    auth = TestBed.get(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should activate logged user', () => {
    auth.setUser('MockUser', false);
    expect(service.canActivate()).toBe(true);
  });

  it('should not activate not logged in', () => {
    expect(service.canActivate()).toBe(false);
  })
});
