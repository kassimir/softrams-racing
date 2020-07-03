import { ModalMock} from './modal.mock';
import {of} from 'rxjs';

export class AppMock {
  getMembers() {
    return of([ModalMock.mock.member]);
  }

  addMember(_) {
    return of('Success!')
  }

  deleteMember(_) {
    return of('Success!')
  }

  getTeams() {
    return of(['Team Softram'])
  }
}
