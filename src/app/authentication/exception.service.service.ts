import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExceptionServiceService {
  constructor() {}
  handleError(error: any) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.error.statusCode}\nMessage: ${error.error.message}`;
    }
    // this.notifier.notify('error', errorMessage);

    return throwError(errorMessage);
  }
}
