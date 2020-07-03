import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _user: string;

  constructor(private router: Router) {
  }

  public setUser(user: string, cache: boolean) {
    this._user = user;

    // Cache is true, if the Remember Me was checked at login
    if (cache) {
      localStorage.setItem('username', user);
    }
  }

  public getUser(): string {
    // If no user is currently stored in the app, check local storage then set it
    if (!this._user && localStorage.getItem('username')) {
      this._user = localStorage.getItem('username');
    }

    return this._user;
  }

  // Remove user from memory and storage
  public killUser(): void {
    this._user = null;
    localStorage.removeItem('username');
    this.router.navigate(['/login'])
  }
}
