import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private _user: string;

    constructor() {}

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

    public killUser(): void {
        this._user = null;
    }
}
