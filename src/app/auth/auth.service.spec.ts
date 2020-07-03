import { TestBed } from '@angular/core/testing';

// Services
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

// Mocks
import { RouterMock } from '../mocks/router.mock';

describe('AppService', () => {

  let service: AuthService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {provide: Router, useClass: RouterMock}
      ],
      imports: []
    });

    service = TestBed.get(AuthService);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set user and store in local storage', () => {
    spyOn(localStorage, 'setItem').and.callFake(() => {});
    service.setUser('MockUser', true);
    expect(localStorage.setItem).toHaveBeenCalledWith('username', 'MockUser')
  });

  it('should set user and not store in local storage', () => {
    spyOn(localStorage, 'setItem').and.callFake(() => {});
    service.setUser('MockUser', false);
    expect(localStorage.setItem).not.toHaveBeenCalled();
  });

  it('should get user from cache', () => {
    spyOn(localStorage, 'getItem').and.callFake((item) => {
      expect(item).toBe('username');
      return 'MockUser';
    });
    service.setUser('MockUser', false);
    expect(service.getUser()).toBe('MockUser');
  });

  it('should get user from storage', () => {
    const storage = {};
    spyOn(localStorage, 'getItem').and.callFake((item) => {
      expect(item).toBe('username');
      return 'MockUser';
    });
    spyOn(localStorage, 'setItem').and.callFake((item: string, username: string) => {
      storage[item] = username;
    });
    // Sets user in cache and in memory
    service.setUser('MockUser', true);
    // Sets memory user to null but keeps cache user
    service.setUser(null, false);
    expect(service.getUser()).toBe('MockUser');
  });

  it('should remove user from existence', () => {
    const storage = {username: 'MockUser'};
    spyOn(localStorage, 'removeItem').and.callFake((item: string) => {
      delete storage[item];
    });
    service.killUser();
    expect(Object.keys(storage).length).toEqual(0);
  })
});
