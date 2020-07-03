import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../models/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  public static toast = new BehaviorSubject<Toast>(null);

  constructor() { }
}
