import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GeneralService } from '../../../helper/general.service';
import { ErrorService } from '../../../helper/error.service';

@Injectable({
  providedIn: 'root',
})
export class DatamarkService {
  constructor(
    public gs: GeneralService,
    private http: HttpClient,
    private err: ErrorService
  ) {}

  sendMessage(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  logout(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_logout',
      body
    );
  }
  getActiveUsers(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_active_users',
      body
    );
  }
  updateSupportGroup(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'update_support_group',
      body
    );
  }
}
