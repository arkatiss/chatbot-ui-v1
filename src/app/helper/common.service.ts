import { Injectable } from '@angular/core';
import { UrlConfigService } from './url-config.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  public urlConfig: any;
  public session: any;
  public http: any;


  constructor(urlConfig: UrlConfigService, http: HttpService) {
    this.urlConfig = urlConfig;
    this.http = http;
  }
}
