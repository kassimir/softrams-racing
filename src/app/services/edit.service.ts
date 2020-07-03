import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EditService {

  public editingMember = new BehaviorSubject<boolean>(false);
  public addingMember = new BehaviorSubject<boolean>(false);

  constructor() { }
}
