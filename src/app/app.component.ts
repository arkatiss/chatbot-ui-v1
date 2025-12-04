import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from './helper/general.service';
import { ApicallService } from './pages/apiservice/apicall.service';
import firebase from 'firebase/compat/app';
import { isSupported, getMessaging, getToken } from 'firebase/messaging';
import 'firebase/analytics';
import 'firebase/messaging';
import 'firebase/auth';
import 'firebase/firestore';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'assignment';

  token: string;
  message: any;
  baseUrl = environment.assetsUrl;
  link: any;
  constructor(
    private router: Router,
    private gs: GeneralService,
    private http: HttpClient,
    private api: ApicallService
  ) {
    window.addEventListener('logout', this.logout.bind(this), true);
    const data = this.gs.getUserToken();
    this.token = '';
    this.token = data;

    if (this.token === null) {
      this.router.navigate(['auth/login']);
      let str = '';
      str = window.location.href;
      if (str?.includes('application') === true) {
        // this.router.navigate(['security/apps']);
        this.link = '';
        this.link = str;
        const obj = this.link.replace(/%22/g, '"');
        const inputJson = obj.split('%20').join(' ');
        sessionStorage.setItem('appVizUrl', inputJson);
      }
    } else {
      let str = '';
      str = window.location.href;
      if (str?.includes('application') === true) {
        this.router.navigate(['security/apps']);
        this.link = '';
        this.link = str;
        const obj = this.link.replace(/%22/g, '"');
        const inputJson = obj.split('%20').join(' ');
        sessionStorage.setItem('appVizUrl', inputJson);
      }
    }

    this.http.get(this.baseUrl).subscribe((res: any) => {
      this.gs.setPropertiesUrl(res);

      if (Object.keys(res).length > 0) {
        isSupported().then(async (supported) => {
          if (!supported) return;

          const firebaseConfig = res.firebase;
          const vapidKey = res.vapidKey;

          if (firebase.apps.length === 0) {
            firebase.initializeApp(firebaseConfig);
          }

          const messaging = getMessaging();

          if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
              navigator.serviceWorker
                .register('assets/firebase-messaging-sw.js')
                .then(async (registration) => {
                  await Notification.requestPermission();

                  const token = await getToken(messaging, {
                    vapidKey,
                    serviceWorkerRegistration: registration,
                  });

                  if (token) {
                    this.gs.setFireBaseToken(token);
                    sessionStorage.setItem('fcmToken', JSON.stringify(token));
                  }
                })
                .catch((err) => console.error(err));
            });
          }
        });

        // if (firebase.messaging.isSupported()) {
        //   const firebaseConfig = res.firebase;
        //   const getVapidKey = res.vapidKey;
        //   if (firebase.apps.length === 0) {
        //     firebase.initializeApp(firebaseConfig);
        //   }
        //   // elements/virtualassist
        //   const messaging = firebase.messaging();
        //   if ('serviceWorker' in navigator) {
        //     window.addEventListener('load', () => {
        //       // navigator.serviceWorker.register('assets/firebase-messaging-sw.js').then((registration) => {
        //       //   messaging.useServiceWorker(registration);
        //       //   messaging.requestPermission().then(() => {
        //       //     messaging.getToken({
        //       //       serviceWorkerRegistration: registration,
        //       //       vapidKey: getVapidKey
        //       //     }).then((fcmToken) => {
        //       //       if (fcmToken) {
        //       //         this.gs.setFireBaseToken(fcmToken);
        //       //         sessionStorage.setItem('fcmToken', JSON.stringify(fcmToken));
        //       //       } else {

        //       //       }
        //       //     }).catch((err) => {

        //       //     });
        //       //   });
        //       // });
        //       navigator.serviceWorker
        //         .register('assets/firebase-messaging-sw.js')
        //         .then(async (registration) => {
        //           const messaging = firebase.messaging();

        //           await Notification.requestPermission();

        //           const token = await messaging.getToken({
        //             vapidKey: getVapidKey,
        //             serviceWorkerRegistration: registration,
        //           });

        //           if (token) {
        //             this.gs.setFireBaseToken(token);
        //             sessionStorage.setItem('fcmToken', JSON.stringify(token));
        //           }
        //         })
        //         .catch((err) => console.error(err));
        //     });
        //   }
        // } else {
        // }
      }
    });
  }
  ngOnInit(): void {
    this.gs.getUserData().subscribe((userData: any) => {
      if (Object.keys(userData).length > 0) {
        const loginuserName = JSON.parse(userData);
        this.gs.getFireBaseToken().subscribe((token: any) => {
          if (Object.keys(token).length > 0) {
            const body = {
              user_name: loginuserName[0].user_name,
              fcm_token: token,
              context: {
                'user-agent': {
                  browser: this.getBrowserName(),
                  browser_version: this.getBrowserVersion(),
                },
                'user-interface': 'web-ui',
              },
            };
            this.gs.sendFirebaseToken(body).subscribe((res) => {});
          }
        });
      }
    });
  }
  logout(): any {
    const body = {};
    this.api.logout(body).subscribe(
      (res) => {
        this.onSuccessslogout(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  getBrowserName(): any {
    const agent = window.navigator.userAgent.toLowerCase();
    switch (true) {
      case agent.indexOf('edg') > -1:
        return 'edge';
      case agent.indexOf('opr') > -1 && !!(window as any).opr:
        return 'opera';
      case agent.indexOf('chrome') > -1 && !!(window as any).chrome:
        return 'chrome';
      case agent.indexOf('trident') > -1:
        return 'ie';
      case agent.indexOf('firefox') > -1:
        return 'firefox';
      case agent.indexOf('safari') > -1:
        return 'safari';
      default:
        return 'other';
    }
  }
  getBrowserVersion(): any {
    var userAgent = navigator.userAgent,
      tem,
      matchTest =
        userAgent.match(
          /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
        ) || [];
    if (/trident/i.test(matchTest[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (matchTest[1] === 'Chrome') {
      tem = userAgent.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }
    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = userAgent.match(/version\/(\d+)/i)) != null)
      matchTest.splice(1, 1, tem[1]);
    return matchTest.join(' ');
  }
  onSuccessslogout(data: any): any {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('chatData');
    this.router.navigateByUrl('auth/login');
    sessionStorage.removeItem('appVizUrl');
    this.router
      .navigateByUrl('auth/login', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['auth/login']);
      });
    window.location.reload();
  }
  onErrorr(error: any): any {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('chatData');
    this.router.navigateByUrl('auth/login');
    sessionStorage.removeItem('appVizUrl');
    this.router
      .navigateByUrl('auth/login', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['auth/login']);
      });
    window.location.reload();
  }
}
