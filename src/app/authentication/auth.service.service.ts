import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationServiceService } from './authentication.service.service';
import { SettingsService } from './settings.service';
import { PushNotifications } from '@capacitor/push-notifications';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  bootinfo: any = {};

  constructor(
    private authServices: AuthenticationServiceService,
    private route: Router,
    private http: HttpClient,
    private settingsService: SettingsService
  ) { }

  login(loginForm: any): Observable<any> {
    return this.authServices.userlogin(loginForm).pipe(
      tap((response: any) => {
        this.saveToken(response.token, response.refreshToken);
        localStorage.setItem('sid', response.sid);
      })
    );
  }

  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>('Account/refreshtoken', { refreshToken }).pipe(
      tap((response: any) => {
        this.saveToken(response.token, response.refreshToken);
      })
    );
  }

  getBootInfo(): Observable<any> {
    return this.settingsService.getBootInfo().pipe();
  }

  getUserFname(): any {
    const userData = localStorage.getItem('firstName');
    return userData !== null ? userData : null;
  }

   getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  getuserName(): string {
    const userData = localStorage.getItem('userName');
    return userData !== null ? userData.toString() : '';
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  saveToken(token: string, refreshToken: string): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('refreshToken', refreshToken);
  }

  doLogout(): void {
    const userData = localStorage.getItem('userName') ?? '';
    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");
    const locationAtLogin = localStorage.getItem('locationAtLogin');
    let location = "";
    if (latitude && longitude) {
      location = latitude + ":" + longitude;
    }
    this.authServices.logOut(userData, location).subscribe({
      next: (res) => {
        PushNotifications.removeAllListeners();
        localStorage.clear();
        sessionStorage.clear();
        if (locationAtLogin) {
          localStorage.setItem('locationAtLogin', locationAtLogin);
        }
        this.route.navigate(['login']);
      }
    });
  }

  getIPAddress(): Observable<any> {
    return this.http.get('https://api.ipify.org/');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  forceLogout(pid: string): Observable<any> {
    return this.authServices.forceLogout(pid).pipe();
  }
}
