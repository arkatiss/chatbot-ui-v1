import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import { WebSocketService } from './websocket.service';

const CHAT_URL = 'ws://192.168.1.6:5678';

@Injectable()
export class MessageService {
  public messages: Subject<any>;

  constructor(_websocket: WebSocketService) {
    this.messages = <Subject<any>>_websocket
      .connect(CHAT_URL)
       .map((response: MessageEvent): any => {

       // return response.data;
      });
  }
}
