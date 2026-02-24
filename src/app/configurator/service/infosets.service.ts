import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from '../../helper/general.service';

@Injectable({
  providedIn: 'root',
})
export class InfosetsService {
  constructor(private http: HttpClient, private general: GeneralService) {}
  domainData(body: any): Observable<any> {
    return this.http.post(
      this.general.getHttpUrl('genAIBotUrl') + 'chat_bot_domain',
      body
    );
  }
  retInfoset(body: any): Observable<any> {
    return this.http.post(
      this.general.getHttpUrl('genAIBotUrl') + 'retrieve_dom_subdo_infoset',
      body
    );
  }
  chatbotMasterData(body: any): Observable<any> {
    return this.http.post(
      this.general.getHttpUrl('genAIBotUrl') + 'chat_bot_master_data',
      body
    );
  }
  saveInfoset(body: any): Observable<any> {
    return this.http.post(
      this.general.getHttpUrl('genAIBotUrl') + 'save_infoset',
      body
    );
  }
  infosetDelete(body: any): Observable<any> {
    return this.http.post(
      this.general.getHttpUrl('genAIBotUrl') + 'delete_infoset',
      body
    );
  }

  insertScrape(body: any): Observable<any> {
    return this.http.post(
      this.general.getHttpUrl('genAIWebSiteBotUrl') + 'wb/website_scrape',
      body
    );
  }

  getScrapList(): Observable<any> {
    return this.http.post(
      this.general.getHttpUrl('genAIWebSiteBotUrl') + 'wb/retrieve_distinct_data',
      {}
    );
  }

  deleteScrape(body: any): Observable<any> {
    return this.http.post(
      this.general.getHttpUrl('genAIWebSiteBotUrl') + 'wb/delete_records',
      body
    );
  }
}
