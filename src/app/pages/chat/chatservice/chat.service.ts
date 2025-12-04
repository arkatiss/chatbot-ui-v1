import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../../helper/error.service';
import { GeneralService } from '../../../helper/general.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  baseUrl: any;
  constructor(
    private http: HttpClient,
    private err: ErrorService,
    private gs: GeneralService
  ) {}

  sendMessage(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  updateSupportGroup(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'update_support_group',
      body
    );
  }
  updateRetPersonChat(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  updateAgentStatus(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'update_agent_chat',
      body
    );
  }
  typingChat(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  getActiveUsers(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_active_users',
      body
    );
  }
  getNotifications(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  transferChat(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_active_status_domain',
      body
    );
  }
  TransferChatAgent(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_api',
      body
    );
  }
  datamarks(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_data_mark',
      body
    );
  }
  suggestions(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_suggestions',
      body
    );
  }
  support(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'support_group',
      body
    );
  }
  fetchHistory(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_agent_chat',
      body
    );
  }
  getClosedClients(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_agent_clients',
      body
    );
  }
  getWareHouseLocations(): Observable<any> {
    return this.gs.getHttpUrl('locations');
  }
}
