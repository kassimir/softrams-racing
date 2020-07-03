export class AuthMock {

  user: string;

  constructor() {
  }

  setUser(user: string) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  killUser() {
    this.user = null;
  }
}
