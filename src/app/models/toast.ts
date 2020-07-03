export class Toast {
    msg: string;
    type: 'success' | 'neutral' | 'error';

    constructor(msg, type) {
      this.msg = msg;
      this.type = type;
    }
}
