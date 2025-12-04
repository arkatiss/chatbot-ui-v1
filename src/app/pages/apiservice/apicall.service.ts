import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../helper/error.service';
import { GeneralService } from '../../helper/general.service';

@Injectable({
  providedIn: 'root',
})
export class ApicallService {
  constructor(
    private err: ErrorService,
    private http: HttpClient,
    private gs: GeneralService
  ) {}

  onSubmit(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_entry',
      body
    );
  }
  getHistoryData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_history',
      body
    );
  }
  sendMessage(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  userStatus(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_user_status',
      body
    );
  }
  updateUserStatus(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'update_user_status',
      body
    );
  }
  logout(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_logout',
      body
    );
  }
  elasticSearch(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_document',
      body
    );
  }
  getUserData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_preferences',
      body
    );
  }
  retrieveDomain(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_domain',
      body
    );
  }
  updateSupportGroup(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'update_support_group',
      body
    );
  }
  getRoles(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_user_roles',
      body
    );
  }
  getSearchedHistoryData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'search_history',
      body
    );
  }
  submitWorkFlow(body: any, url: any): Observable<any> {
    return this.http.post(url, body);
  }
  getChainData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_chains_stores',
      body
    );
  }
  getAppData(extendUrl: any): Observable<any> {
    return this.http.get(extendUrl);
  }
  createAutoTask(apiurl: any, url: any): Observable<any> {
    return this.http.post(apiurl, url);
  }
  getListData(apiurl: any, url: any): Observable<any> {
    return this.http.post(apiurl, url, { observe: 'response' });
  }
}
