import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Member } from '../models/member';
import {Modal} from '../models/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private static modalState = {
    show: false,
    member: new Member(null, '', '', '', '', '')
  };

  public static state = new BehaviorSubject<Modal>(ModalService.modalState);
  public static confirm = new BehaviorSubject<boolean>(false);

  constructor() { }
}
