import { Subject } from 'rxjs';
import { Toast } from '../models/toast';

export class ToastMock {
  public static toast = new Subject<Toast>();
}
