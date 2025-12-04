import { Injectable } from '@angular/core';
import { UrlConfigService } from './../helper/url-config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Router } from '@angular/router';
import { CommonService } from '../helper/common.service';
import { GeneralService } from '../helper/general.service';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  token: any;
  roledata: any;
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private common: CommonService,
    private gs: GeneralService
  ) {
    const data = this.gs.getUserToken();
    this.token = '';
    this.token = data;
    // const token = JSON.parse(data);
    // this.session_id = token[0].session_id;
    if (this.token === null) {
      this.router.navigate(['auth/login']);
    } else {
    }
  }
  getToken() {
    const data = this.gs.getUserToken();
    const token = data;
    const userId = token[0].user_name;
    const res = userId.split('@');
    const obj = {
      session_id: token[0].session_id,
      user_id: token[0].user_id,
      user_name: token[0].user_name,
      user_name_id: res[0],
    };
    return obj;
  }

  getuserID() {
    return this.token[0].user_id;
  }

  getusername() {
    const data = this.gs.getUserToken();
    const token = data;
    const userId = token[0].user_name;
    return userId;
  }

  getSessionID() {
    const data = this.gs.getUserToken();
    const token = data;
    const session_id = token[0].session_id;
    return session_id;
  }

  getUserSess() {
    const data = this.gs.getUserToken();
    const token = data;
    const userId = token[0].user_name;
    const res = userId.split('@');
    const obj = {
      session_id: token[0].session_id,
      user_name: token[0].user_name,
    };
    return obj;
  }
  setRoleData(data: any): any {
    this.roledata = data;
  }
  getRoleData(): any {
    return this.roledata;
  }
}
