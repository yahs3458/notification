import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { apiUrl } from './api-url';
import { UserAuthRequest } from './Userauthrequest';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationServiceService {
  private APIBaseUrl: string;
  constructor(private http: HttpClient) {
    this.APIBaseUrl = environment.API_BASE_URL;
  }
  userlogin(UserAuthRequest: UserAuthRequest): Observable<any> {
    return this.http.post(
      this.APIBaseUrl + apiUrl.API_AdminLogin_URL,
      UserAuthRequest,
      {
        headers: this.getHeaders(),
      }
    );
  }
  logOut(user:string,location:string):Observable<any>{
    return this.http.get(this.APIBaseUrl + apiUrl.APIURL_Logout+ '/' + user + '/'+location);
  }
  getHeaders() {
    let headerOption = new HttpHeaders();
    headerOption.append('Content-Type', 'application/json');
    headerOption.append('X-Requested-With', 'XMLHttpRequest');
    headerOption.append('Access-Control-Allow-Origin', '*');
    return headerOption;
  }
  forceLogout(pid: String): Observable<any> {
    return this.http.get(this.APIBaseUrl + apiUrl.APIURL_Force_Logout + '/' + pid);
  }
}
