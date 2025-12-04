import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GeneralService } from '../../../helper/general.service';
import { ErrorService } from '../../../helper/error.service';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    public gs: GeneralService,
    private http: HttpClient,
    private err: ErrorService
  ) {}
  login(body: any): Observable<any> {
    return this.http
      .post(this.gs.getHttpUrl('serverHost') + 'chat_bot_login', body)
      .pipe(catchError(this.err.handleError));
  }
  logout(body: any): Observable<any> {
    return this.http
      .post(this.gs.getHttpUrl('serverHost') + 'chat_bot_logout', body)
      .pipe(catchError(this.err.handleError));
  }
}
