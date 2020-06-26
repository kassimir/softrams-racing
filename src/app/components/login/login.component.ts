import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public loginForm: FormGroup;
  public rememberMe = false;
  public focusedInput: 'username' | 'password' = 'username';
  public validationChecks = {
    sixChars: false,
    lettersNumbers: false,
    eightChars: false,
    containsNum: false,
    containsUpper: false,
    containsLower: false,
    containsSpecial: false
  };

  constructor(private fb: FormBuilder, private router: Router, private auth: AuthService) {
  }

  public ngOnInit() {
    // If someone is logged in, it's best to force them to log out first, so redirect to /members
    if (this.auth.getUser()) {
      this.router.navigate(['/members']);
    }

    this.loginForm = this.fb.group({
      // Username must be at least 6 characters long and contain only letters and numbers. And underscore, for some reason.
      username: new FormControl('', this.getValidators(/[\w]{6,}/)),
      // Password must be at least 8 characters long, have at least one number, an uppercase letter, a lowercase letter, and a special character
      password: new FormControl('', this.getValidators(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)),
      remember: new FormControl()
    });
  }

  public setFocusInput(val: 'username' | 'password'): void {
    this.focusedInput = val;
  }

  public validate(): void {
    this.validationChecks = {
      sixChars: this.loginForm.get('username').value.length >= 5,
      lettersNumbers: this.loginForm.get('username').value.match(/[A-Z|a-z]/),
      eightChars: this.loginForm.get('password').value.length >= 7,
      containsNum: this.loginForm.get('password').value.match(/[0-9]/),
      containsUpper: this.loginForm.get('password').value.match(/[A-Z]/),
      containsLower: this.loginForm.get('password').value.match(/[a-z]/),
      containsSpecial: this.loginForm.get('password').value.match(/[@$!%*?&]/)
    };
  }

  public setRemember(e: boolean): void {
    this.rememberMe = e;
  }

  public login(): void {
    this.auth.setUser(this.loginForm.value.username, this.rememberMe);
    this.router.navigate(['/members']);
  }

  private getValidators(pattern: RegExp) {
    return [Validators.required, Validators.pattern(pattern)];
  }
}
