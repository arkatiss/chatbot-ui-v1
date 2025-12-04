import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GeneralService } from '../../helper/general.service';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  constructor(private http: HttpClient, private gs: GeneralService) {}
  private usersData = new BehaviorSubject<any>({});
  private domainsData = new BehaviorSubject<any>({});
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
  addDomain(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'chat_bot_domain',
      body
    );
  }
  maping(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'domain_mapping',
      body
    );
  }
  roles(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'user_roles',
      body
    );
  }
  support(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'support_group',
      body
    );
  }
  getAppNames(): Observable<any> {
    return this.http.get(this.gs.getHttpUrl('serverHost') + 'app_viz');
  }
  vizroles(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'app_viz_roles',
      body
    );
  }
  getAppData(extendUrl: any): Observable<any> {
    return this.http.get(
      this.gs.getHttpUrl('serverHost') + 'app_viz?' + extendUrl
    );
  }
  getGridAppData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'app_viz_ops',
      body
    );
  }
  setUsersData(data: any): any {
    this.usersData.next(data);
  }
  getAllUserData(): any {
    return this.usersData.asObservable();
  }
  setDomainsData(data: any): any {
    this.domainsData.next(data);
  }
  getDomainData(): any {
    return this.domainsData.asObservable();
  }
  createAutoTask(body: any, url: any): Observable<any> {
    return this.http.post(url, body);
  }
}
