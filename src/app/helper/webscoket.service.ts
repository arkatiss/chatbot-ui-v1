// import { Injectable } from '@angular/core';
// import * as Rx from 'rxjs/Rx';
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs/Observable';

// @Injectable()
// export class WebSocketService {
//   public ws: any;

//   constructor() { }

//   private subject: Rx.Subject<MessageEvent>;
//   private connected$ = new Subject<any>();

//   public connect(url): Rx.Subject<MessageEvent> {
//     if (!this.subject) {
//       this.subject = this.create(url);
//       this.connected$.next(true);
//     }
//     return this.subject;
//   }

//   public connected(): Observable<any> {
//     return this.connected$.asObservable();
//   }

//   private create(url): Rx.Subject<MessageEvent> {
//     this.ws = new WebSocket(url);

//     const observable = Rx.Observable.create(
//       (obs: Rx.Observer<MessageEvent>) => {
//         this.ws.onmessage = obs.next.bind(obs);
//         this.ws.onerror = obs.error.bind(obs);
//         this.ws.onclose = obs.complete.bind(obs);
//         return this.ws.close.bind(this.ws);
//       });
//     const observer = {
//       // tslint:disable-next-line: ban-types
//       next: (data: Object) => {
//         if (this.ws.readyState === WebSocket.OPEN) {
//           this.ws.send(JSON.stringify(data));
//         }
//       }
//     };
//     return Rx.Subject.create(observer, observable);
//   }

//   close() {
//     if (this.ws) {
//         this.ws.close();
//         this.subject = null;
//     }
//   }

// }

import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private ws!: WebSocket;
  private subject!: Subject<MessageEvent>;
  private connected$ = new Subject<boolean>();

  connect(url: string): Subject<MessageEvent> {
    if (!this.subject) {
      this.ws = new WebSocket(url);

      this.subject = new Subject<MessageEvent>();

      this.ws.onmessage = (msg) => this.subject.next(msg);
      this.ws.onerror = (err) => this.subject.error(err);
      this.ws.onclose = () => this.subject.complete();

      this.connected$.next(true);
    }

    return this.subject;
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  connected(): Observable<boolean> {
    return this.connected$.asObservable();
  }

  close() {
    if (this.ws) {
      this.ws.close();
      this.subject = undefined!;
    }
  }
}
