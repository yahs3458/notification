import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  constructor(private http: HttpClient) {
    this.APIBaseUrl = environment.API_BASE_URL;
  }
  APIBaseUrl: string;
  APIUrl = 'NotificationLog/get_notificationLogs';
  APIPUT = 'Account/received_logInPermission';

  getDetailsById(limit: any): Observable<any> {
    return this.http.get(this.APIBaseUrl + this.APIUrl +  '/'  + limit);
  }
  putstatus(id : any , status :string ,docname:any): Observable<any> {
    return this.http.get(this.APIBaseUrl + this.APIPUT + '/'  + status  + '/'  + id+ '/'  + docname);
  }
}
