import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';

import { AppService } from './app.service';
import { AuthGuard } from './auth/authguard.service';
import { AuthService } from './auth/auth.service';

import { AppComponent } from './app.component';
import { BannerComponent } from './banner/banner.component';
import { MembersComponent } from './components/members/members.component';
import { LoginComponent } from './components/login/login.component';
import { Interceptor } from './auth/http.interceptor';
import { TableComponent } from './components/table/table.component';
import { TableRowComponent } from './components/table-row/table-row.component';

const ROUTES = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'members',
    canActivate: [AuthGuard],
    component: MembersComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  declarations: [AppComponent, BannerComponent, MembersComponent, LoginComponent, TableComponent, TableRowComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, { useHash: false }),
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    AppService,
    HttpClient,
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: Interceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
