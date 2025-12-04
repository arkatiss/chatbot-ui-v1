import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../helper/error.service';
import { GeneralService } from '../../helper/general.service';
@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    private err: ErrorService,
    private http: HttpClient,
    private gs: GeneralService
  ) {}
  logout(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_logout',
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
      this.gs.getHttpUrl('serverHost') + 'update_support_group',
      body
    );
  }
  getInfosetData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_infoset',
      body
    );
  }
  changeInfoset(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'view_infoset',
      body
    );
  }
  getUserNames(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_usernames',
      body
    );
  }
  AddAdminData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_data_auth',
      body
    );
  }
  addDomain(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_domain',
      body
    );
  }
  chatbotMasterData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_master_data',
      body
    );
  }
  saveInfoset(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'save_infoset',
      body
    );
  }
  delInfoset(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'delete_infoset',
      body
    );
  }
  showConnectorsList(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_connectors',
      body
    );
  }
  retDomSubDomInfoset(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_dom_subdo_infoset',
      body
    );
  }
  retrainYml(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retraining_yaml',
      body
    );
  }
  retrainingData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retraining_data',
      body
    );
  }
  retrieveContext(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieve_context',
      body
    );
  }
  getConfiguration(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_configuration',
      body
    );
  }
}
