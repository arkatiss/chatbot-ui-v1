import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import {
  EMPTY,
  throwError,
  of,
  Subject,
  BehaviorSubject,
  Observable,
} from 'rxjs';
import { GeneralService } from '../helper/general.service';
import { AuthService } from '../auth/auth.service';
import { LoggingService } from '../helper/logging.service';
@Injectable({
  providedIn: 'root',
})
export class PagesService {
  http: any;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private jsondata = new BehaviorSubject<any>({});
  private chatData = new BehaviorSubject<any>({});
  private storeWindowData = new BehaviorSubject<any>({});
  private storeAggridData = new BehaviorSubject<any>({});
  private dashboardValue = new BehaviorSubject<any>({});
  private TabData = new BehaviorSubject<any>({});
  private enableData = new BehaviorSubject<any>({});
  private openChatData = new BehaviorSubject<any>({});
  private setAllDocsData = new BehaviorSubject<any>({});
  private VoiceData = new BehaviorSubject<any>({});

  private removeUser = new BehaviorSubject<any>({});
  private agentstatus = new BehaviorSubject<any>({});
  private jsonDiagnosticsData = new BehaviorSubject<any>({});
  private viewData = new BehaviorSubject<any>({});
  private allUsersData = new BehaviorSubject<any>({});
  private allIntentsData = new BehaviorSubject<any>({});
  private AnnotationData = [];
  userDetails: { user_name: any; session_id: any } | any;
  session_id: any;
  user_name: any;

  acceptedAgentUsers = new BehaviorSubject<any>({});

  constructor(private auth: AuthService) {
    this.session_id = this.auth.getSessionID();
    this.user_name = this.auth.getusername();
  }
  private keys: Subject<any> = new Subject<any>();
  keys$: Observable<any> = this.keys.asObservable();

  private values: Subject<any> = new Subject<any>();
  values$: Observable<any> = this.values.asObservable();
  handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error!';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
  setDashboard(data: any): any {
    this.dashboardValue.next(data);
  }
  setTabData(data: any): any {
    this.TabData.next(data);
  }
  getTabData(): any {
    return this.TabData.asObservable();
  }
  getDashboard(): any {
    return this.dashboardValue.asObservable();
  }
  switchData(data: any): any {
    this.enableData.next(data);
  }
  getSwitchData(): any {
    return this.enableData.asObservable();
  }
  setOpenChat(data: any): any {
    this.openChatData.next(data);
  }
  getOpenChat(): any {
    return this.openChatData.asObservable();
  }
  setVoiceData(data: any): any {
    this.VoiceData.next(data);
  }
  getVoiceChat(): any {
    return this.VoiceData.asObservable();
  }

  setChatData(data: any): any {
    this.chatData.next(EMPTY);
    this.chatData.next(data);
  }
  getChatData(): any {
    return this.chatData.asObservable();
  }
  storevalues(k: any): any {
    this.values.next(k);
    this.storeAggridData.next(k);
  }
  getAggridData(): any {
    return this.storeAggridData.asObservable();
  }
  getValues(): any {
    return this.values.asObservable();
  }
  storejson(j: any): any {
    this.jsondata.next(j);
  }
  getjson(): any {
    return this.jsondata.asObservable();
  }
  setDocsData(data: any): any {
    this.setAllDocsData.next(data);
  }
  getAllDocs(): any {
    return this.setAllDocsData.asObservable();
  }
  errorControl(error: any): any {}
  calculateTime(start: any, end: any): any {
    let timeDiff = end - start;
    timeDiff /= 1000;
    const seconds = Math.round(timeDiff);
    return seconds;
  }
  setWindow(data: any): any {
    this.storeWindowData.next(data);
  }
  getWindow(): any {
    return this.storeWindowData.asObservable();
  }

  setStatusUser(data: any): any {
    this.removeUser.next(data);
  }
  getStatusUser(): any {
    return this.removeUser.asObservable();
  }
  setAgentStatus(data: any): any {
    this.agentstatus.next(data);
  }
  getAgentStatus(): any {
    return this.agentstatus.asObservable();
  }
  setDiagnosticsData(data: any): any {
    this.jsonDiagnosticsData.next(data);
  }
  getDiagnosticsData(): any {
    return this.jsonDiagnosticsData.asObservable();
  }
  setShowView(data: any): any {
    this.viewData.next(data);
  }
  getShowView(): any {
    return this.viewData.asObservable();
  }
  setAnnotationData(data: any): void {
    this.AnnotationData = data;
  }
  getAnnotationData(): any {
    return this.AnnotationData;
  }
  setAcceptedData(data: any): void {
    this.acceptedAgentUsers.next(data);
  }
  getAcceptedData(): any {
    return this.acceptedAgentUsers.asObservable();
  }
  setAllUsersData(data: any): any {
    this.allUsersData.next(data);
  }
  getAllUsersData(): any {
    return this.allUsersData.asObservable();
  }
  setIntentsData(data: any): any {
    this.allIntentsData.next(data);
  }
  getIntentsData(): any {
    return this.allIntentsData.asObservable();
  }
}
