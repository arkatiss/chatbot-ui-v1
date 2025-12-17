import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';
import firebase from 'firebase/compat/app';
import { isSupported, getMessaging, onMessage } from 'firebase/messaging';
import 'firebase/analytics';
import 'firebase/messaging';
import 'firebase/auth';
import 'firebase/firestore';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  token = new BehaviorSubject(null);

  private tempData = new BehaviorSubject<any>({});
  constructor() {
    // if (firebase.messaging.isSupported()) {
    //   navigator.serviceWorker.addEventListener('message', (event) => {
    //     this.processMessage(event.data);
    //   });
    // } else {
    // }
    isSupported().then((supported) => {
      if (supported) {
         const messaging = getMessaging();
        // navigator.serviceWorker.addEventListener('message', (event) => {
        //   this.processMessage(event.data);
        // });
         onMessage(messaging, (payload) => {
                    console.log('Foreground message:', payload);
                    this.processMessage(payload);
                  });

                  // Handle messages from service worker (BACKGROUND)
                  navigator.serviceWorker.addEventListener(
                    'message',
                    (event) => {
                      console.log('Message from SW:', event.data);

                      if (
                        event.data &&
                        event.data.type === 'FIREBASE_NOTIFICATION'
                      ) {
                        this.processMessage(event.data);
                      }
                    }
                  );
      }
    });
    fromEvent(window, 'myCustomEvent').subscribe((item: any) => {
      this.tempData.next(item);
    });
  }
  processMessage(data: any): any {
    this.currentMessage.next(data);
  }
  getTempData(): any {
    return this.tempData.asObservable();
  }
  getPermission(): any {
    return this.token.asObservable();
  }
  recievedCloudMessage(): any {
    // console.log(this.currentMessage);
    return this.currentMessage.asObservable();
  }
}
