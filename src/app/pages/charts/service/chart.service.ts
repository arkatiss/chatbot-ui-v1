import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../../helper/error.service';
import { GeneralService } from '../../../helper/general.service';

@Injectable({
  providedIn: 'root',
})
export class ChartService {
  constructor(
    private err: ErrorService,
    private http: HttpClient,
    private gs: GeneralService
  ) {}
  getChartsData(body: any): Observable<any> {
    return this.http
      .post(this.gs.getHttpUrl('serverHost') + 'chat_bot_analytics', body)
      .pipe(catchError(this.err.handleError));
  }
  getActiveUsers(body: any): Observable<any> {
    return this.http
      .post(this.gs.getHttpUrl('serverHost') + 'chat_bot_active_users', body)
      .pipe(catchError(this.err.handleError));
  }
  getPreferences(body: any): Observable<any> {
    return this.http
      .post(this.gs.getHttpUrl('serverHost') + 'chat_bot_preferences', body)
      .pipe(catchError(this.err.handleError));
  }
  sendMessage(body: any): Observable<any> {
    return this.http
      .post(this.gs.getHttpUrl('serverHost') + 'chat_bot_api', body)
      .pipe(catchError(this.err.handleError));
  }

  support(body: any): Observable<any> {
    return this.http
      .post(this.gs.getHttpUrl('serverHost') + 'support_group', body)
      .pipe(catchError(this.err.handleError));
  }
  getAgentAnalyticsData(body: any): Observable<any> {
    return this.http
      .post(this.gs.getHttpUrl('serverHost') + 'agent_analytics', body)
      .pipe(catchError(this.err.handleError));
  }
}
