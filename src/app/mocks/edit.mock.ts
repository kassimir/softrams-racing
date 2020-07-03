import { Subject } from 'rxjs';

export class EditMock {

  editingMember = new Subject<boolean>();
  addingMember = new Subject<boolean>();

  constructor() {
  }
}
