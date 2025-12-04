import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorService } from '../../helper/error.service';
import { GeneralService } from '../../helper/general.service';

@Injectable({
  providedIn: 'root',
})
export class AnnotatorService {
  constructor(
    private err: ErrorService,
    private http: HttpClient,
    private gs: GeneralService
  ) {}
  onSubmit(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'bot_training_utterances',
      body
    );
  }
  botTraining(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'bot_training',
      body
    );
  }
  onInitialise(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retrieving_bot_tarining_domains',
      body
    );
  }
  retrainingData(body: any): Observable<any> {
    return this.http.post(
      this.gs.getHttpUrl('serverHost') + 'retraining_data',
      body
    );
  }
}
