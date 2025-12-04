import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from './error.service';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  // storedData=[];
  storedFormData = [];
  private newMail = new BehaviorSubject<any>({});
  private storedData = new BehaviorSubject<any>({});
  public sessionStorage: Storage;
  httpUrl: any;
  userRole = new BehaviorSubject<any>({});
  secureAgentTab = new BehaviorSubject<any>({});
  storedFireBaseKey = new BehaviorSubject<any>({});
  hideMenu = new BehaviorSubject<any>({});
  storedUserData = new BehaviorSubject<any>({});
  dynamicFormsData = new BehaviorSubject<any>({});
  storedPreferences: any;
  constructor(private err: ErrorService, private http: HttpClient) {
    this.sessionStorage = window.sessionStorage;
  }
  setData(data: any): any {
    this.storedData.next(data);
  }
  getData(): any {
    return this.storedData.asObservable();
  }
  setFormData(data: any): any {
    this.newMail.next(data);
  }
  getFormData(): any {
    return this.newMail.asObservable();
  }
  setSessionState(data: any): any {
    this.sessionStorage.setItem('chatData', JSON.stringify(data));
  }
  // loadIframeData(url): any {

  // }
  getSessionState(): any {
    const chatData: any = this.sessionStorage.getItem('chatData');
    return JSON.parse(chatData);
  }
  setUserToken(data: any): any {
    this.sessionStorage.setItem('user', data);
    this.setUserData(data);
  }
  hideDashboard(data: any): any {
    this.hideMenu.next(data);
  }
  setUserData(data: any): any {
    this.storedUserData.next(data);
  }
  getUserData(): any {
    return this.storedUserData.asObservable();
  }
  gethideDashBoard(): any {
    return this.hideMenu.asObservable();
  }
  getUserToken(): any {
    const user: any = this.sessionStorage.getItem('user');
    return JSON.parse(user);
  }
  setUserRoleData(data: any): any {
    //this.sessionStorage.setItem('roles', JSON.stringify(data));
    this.userRole.next(data);
  }
  setShowAgent(data: any): void {
    this.secureAgentTab.next(data);
  }
  getShowAgent(): any {
    return this.secureAgentTab.asObservable();
  }
  getUserRoleData(): any {
    //return JSON.parse(this.sessionStorage.getItem('roles'));
    return this.userRole.asObservable();
  }
  setPropertiesUrl(url: any): void {
    //this.sessionStorage.setItem('assetsurl', JSON.stringify(url));
    this.httpUrl = url;
  }
  getPropertiesUrl(): any {
    //return JSON.parse(this.sessionStorage.getItem('assetsurl'));
    return this.httpUrl;
  }
  getHttpUrl(serviceName: any): any {
    //this.httpUrl = JSON.parse(this.sessionStorage.getItem('assetsurl'));
    const url = this.httpUrl[serviceName];
    return url;
  }
  getCssUrl(cssName: any): any {
    //const cssurl = JSON.parse(this.sessionStorage.getItem('assetsurl'));
    const url = this.httpUrl[cssName];
    return url;
  }
  logout(body: any): Observable<any> {
    return this.http
      .post(this.getHttpUrl('serverHost') + 'chat_bot_logout', body)
      .pipe(catchError(this.err.handleError));
  }
  setFireBaseToken(data: any): void {
    this.storedFireBaseKey.next(data);
  }
  getFireBaseToken(): any {
    return this.storedFireBaseKey.asObservable();
  }
  sendFirebaseToken(body: any): Observable<any> {
    return this.http.post(
      this.getHttpUrl('serverHost') + 'firebase_token',
      body
    );
  }
  setDynamicFormsData(data: any): void {
    this.dynamicFormsData.next(data);
  }
  getDynamicFormsData(): any {
    return this.dynamicFormsData.asObservable();
  }
  storePreferences(data: any): any {
    this.storedPreferences = data;
  }
  getStoredPreferences(): any {
    return this.storedPreferences;
  }
}
