import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable()
export class WebSocketService {
  constructor() {}

  private subject: Subject<MessageEvent> | any;
  private connected$ = new Subject<any>();

  public connect(url: any): Subject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url);
      this.connected$.next(true);
    }
    return this.subject;
  }

  public connected(): Observable<any> {
    return this.connected$.asObservable();
  }

  // private create(url:any): Subject<MessageEvent> {
  //   const ws = new WebSocket(url);

  //  const observable = new Observable((obs: Observer<MessageEvent>) => {
  //       ws.onmessage = obs.next.bind(obs);
  //       ws.onerror = obs.error.bind(obs);
  //       ws.onclose = obs.complete.bind(obs);
  //       return ws.close.bind(ws);
  //     });
  //   const observer = {
  //     // tslint:disable-next-line: ban-types
  //     next: (data: Object) => {
  //       if (ws.readyState === WebSocket.OPEN) {
  //         ws.send(JSON.stringify(data));
  //       }
  //     }
  //   };
  //   return Rx.Subject.create(observer, observable);
  // }

  private create(url: string): Subject<MessageEvent> {
    const ws = new WebSocket(url);

    // Incoming WS events → Observable
    const observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);

      return () => ws.close();
    });

    // Outgoing events → WS
    const observer = {
      next: (data: any) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      },
    };

    // Replacement for Subject.create()
    const subject = new Subject<MessageEvent>();

    // Incoming WebSocket messages → Subject
    observable.subscribe(subject);

    // Outgoing Subject messages → WebSocket
    subject.subscribe(observer);

    return subject;
  }
}
