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
  APIUrl = '';
  APIPUT = '';
  getinstituteList(id: string): Observable<any> {
    return this.http.get(this.APIBaseUrl + this.APIUrl + '/' + id);
  }

  putstatus(id : any , status :string): Observable<any> {
    return this.http.get(this.APIBaseUrl + this.APIPUT + '/'  + id  + '/'  + status);
  }
}
