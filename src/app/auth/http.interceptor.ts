import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthService } from './auth.service';
import { EMPTY, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class Interceptor implements HttpInterceptor {
    private api = 'http://localhost:8000/api';

    constructor(private auth: AuthService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.auth.getUser()) {
            request = request.clone({
                url: `${this.api}/${request.url}`,
                setHeaders: {
                    'x-username': this.auth.getUser()
                }
            });
            return next.handle(request);
        } else {
            this.router.navigate(['/login']);
            return EMPTY;
        }
    }
}
