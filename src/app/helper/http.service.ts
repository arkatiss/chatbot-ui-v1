import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlConfigService } from './url-config.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { ErrorService } from './error.service';
@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private urls;
  private baseUrl: any;
  private OraceBaseUrl: any;
  private OraceBaseUrlTwo: any;
  private logurl: any;
  apiCall: any;
  asdaUrl: any;
  private stopTimer: any;
  constructor(
    private httpClient: HttpClient,
    private UrlConfig: UrlConfigService,
    private snack: MatSnackBar,
    private spinner: NgxSpinnerService,
    private errorService: ErrorService
  ) {
    this.urls = this.UrlConfig.getUrls();
    this.logurl = this.UrlConfig.getLoginAuth();
  }

  post(url: any, body: any, success: any, error: any): any {
    // let headers = {};
    // if (options !== undefined) {
    //   headers = options;
    // }
    this.apiCall = this.httpClient.post(this.getUrl(url), body).subscribe(
      (response) => {
        success(response);
      },
      (err) => {
        const errorMsg = this.errorService.handleError(err);
        error(errorMsg);
      }
    );
  }
  post2(url: any, body: any, success: any, error: any): any {
    // let headers = {};
    // if (options !== undefined) {
    //   headers = options;
    // }
    this.apiCall = this.httpClient.post(this.getUrl(url), body).subscribe(
      (response) => {
        success(response);
      },
      (err) => {
        error(err);
      }
    );
  }

  getLog(url: any, body: any, success: any, error: any): any {
    this.apiCall = this.httpClient.post(this.getLoginAuth(url), body).subscribe(
      (response) => {
        success(response);
      },
      (err) => {
        const errorMsg = this.errorService.handleError(err);
        error(errorMsg);
      }
    );
  }

  cancelCall(): any {
    this.apiCall.unsubscribe();
  }

  /* Subscribe method ends*/

  getLoginAuth(url: any): any {
    return this.baseUrl + this.logurl[url];
  }
  getAsdaurl(url: any): any {
    return this.asdaUrl + this.urls[url];
  }
  getUrl(name: any): any {
    return this.baseUrl + this.urls[name];
  }

  getOracUrl(name: any): any {
    return this.OraceBaseUrl + this.urls[name];
  }
  getOracUrlTwo(name: any): any {
    return this.OraceBaseUrlTwo + this.urls[name];
  }

  ApiTimeOut(): any {
    const seconds = +this.UrlConfig.APITIMER();
    const time = this.UrlConfig.APITIMER();
    const obj = time.split('0');
    this.stopTimer = setTimeout(() => {
      this.cancelCall();
      this.spinner.hide();
      this.snack.open(
        'Data could not be retrived in time. Request terminated',
        'Ok'
      ); /*  + obj[0] + */
    }, seconds);
  }

  ClearTimer(): any {
    clearTimeout(this.stopTimer);
  }
}
