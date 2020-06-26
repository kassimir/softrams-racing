import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {}

  logout() {
    this.auth.killUser();
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
