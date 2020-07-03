import { Member } from '../models/member';

export class ModalMock {

  public static mock = {show: true, member: new Member(1, 'Mock', 'User', 'Driver', 'Softram', 'Active')};

  constructor() {

  }
}
