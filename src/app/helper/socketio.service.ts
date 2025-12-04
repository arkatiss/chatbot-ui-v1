import { Injectable, EventEmitter } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import * as socketIo from 'socket.io-client';
// import { Socket } from 'interfaces';
import { Socket } from 'socket.io';
import { UrlConfigService } from './../helper/url-config.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  error: any;
  custompath: string;
  socket: Socket;
  initialflag = 'true';
  observer: Observer<any>;
  public socketIoURL = 'http://enjrhdhatools01aqa.cswg.com:';
  
  constructor() { }

  getData(port: string,msg, lostconnection?: string): Observable<any> {
    this.socket = socketIo(this.socketIoURL +  port,{ query: msg }); // { path: this.custompath }
   //this.socket = socketIo(this.socketIoURL +  port,{ query: "inputmessage" }); // { path: this.custompath }
debugger
    this.socket.on('connect', () => {
      this.observer.next('Socket Connected');
      if (lostconnection !== undefined && lostconnection === 'true') {
        this.socket.disconnect(true);
      }
    });

    this.socket.on('connect_error', (err) => {
      this.observer.next('ERR_CONNECTION_REFUSED');
      this.socket.disconnect(true);
      this.initialflag = 'true';
    });

    // To support Quick Initial Data Loading
    this.socket.on('initialdata', (res) => {
      if (res != null && res.data !== 'null') {
        const res1 = JSON.parse(res.data);
        if (this.initialflag === 'true' && res1.length > 0) {
          res1.rport = `${port}`;
          this.observer.next(res1);
          this.initialflag = 'false';
        }
      }
    });


    this.socket.on('data', (res) => {
      if (res != null && res.data !== 'null' && res.data !== 'no records found' && res.data !== 'Webservice failure' && res.data !== '0') {
        const res1 = JSON.parse(res.data);
        res1.rport = `${port}`;
        this.observer.next(res1);
      }
      if (res === null || res.data === 'no records found' || res.data === 'Webservice failure') {
        res = res.data;
        this.observer.next(res);
      }
    });
    return this.createObservable();
  }

  createObservable(): Observable<any> {
    return new Observable<any>(observer => {
      this.observer = observer;
    });
  }

  unsubscribeSocket() {
   
    this.socket.disconnected = true;
    this.socket.connected = false;
  }
}
