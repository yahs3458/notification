import { Injectable, Injector } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, Observable, switchMap, throwError } from 'rxjs';
import { AuthServiceService } from './auth.service.service';
import { AuthenticationServiceService } from './authentication.service.service';
import { ExceptionServiceService } from './exception.service.service';
import { apiUrl } from './api-url';
import { IonLoaderService } from '../ion-loader.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  TOKEN_HEADER_KEY: string = 'Authorization';
  private isRefreshing = false;
  constructor(private authService: AuthServiceService,
    private exceptionService: ExceptionServiceService,
    private inject: Injector,
    private loaderService:IonLoaderService
    
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError((err: HttpErrorResponse) => {
          this.loaderService.presentFailToast("Error");
          
          if ([401, 403].includes(err.status)) {
            const apiUrls = Object.values(apiUrl); 
            const shouldHandleError = apiUrls.some(apiUrl => request.url.includes(apiUrl));
            if (shouldHandleError) {
              return this.handle401Error2(request, next);
            }
          } else if ([501, 500].includes(err.status) && err.error.message != 'Unauthorized Access!!!') {
            this.exceptionService.handleError(err);
          } else if (err.error.message == 'Unauthorized Access!!!') {
            return this.handle401Error2(request, next);
          } else if ([400].includes(err.status)) {
            this.loaderService.presentFailToast("NOT Found");
          } else if ([0].includes(err.status)) {
            this.loaderService.presentFailToast('There is a network issue, please reload or try again after sometime');
          }
    
          return throwError(err);
        }));
      }
    
      private handle401Error2(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authService = this.inject.get(this.authService);
        
        return authService.refreshToken().pipe(
          switchMap((data: any) => {
            authService.saveToken(data.token);
            return next.handle(this.addTokenHeader(request, data.token));
          }),
          catchError((err) => {
            authService.doLogout();
            return throwError(err);
          })
        );
      }
    
      private addTokenHeader(request: HttpRequest<any>, token: string): HttpRequest<any> {
        return request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
}