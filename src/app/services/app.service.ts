import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Member } from '../models/member';
import { Team } from '../models/team';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {}

  // Returns all members
  public getMembers(): Observable<Member[]> {
    return this.http
      .get('members')
      .pipe(catchError(this.handleError));
  }

  // Adds a member
  public addMember(member): Observable<any> {
    return this.http
        .post('addMember', member, {observe: 'body', responseType: 'text'})
        .pipe(catchError(this.handleError));
  }

  // Deletes a member
  public deleteMember(memberId: number): Observable<any> {
    return this.http
        .post('deleteMember', {id: memberId}, {observe: 'body', responseType: 'text'})
        .pipe(catchError(this.handleError));
  }

  // Returns all teams
  getTeams(): Observable<Team[]> {
    return this.http
      .get('teams')
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return [];
  }
}
