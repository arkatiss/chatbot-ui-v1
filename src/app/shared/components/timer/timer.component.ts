import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../helper/general.service';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  constructor(
    private gs: GeneralService,
    private dialog: MatDialog,
    private router: Router
  ) {}
  display: any;
  timeoutvalue: number | any;
  timeLeft: number = 0;
  interval: any;
  public EVENT_WATCH_LIST: string[] = [
    'mouseup',
    'mousedown',
    'scroll',
    'keydown',
    'DOMMouseScroll',
    'mousewheel',
    'MSPointerMove',
    'touchmove',
  ];
  private readonly CHECK_FREQUENCY_MS = 1000 * 60;
  private idleCounterTarget: number | undefined = undefined;
  private eventActivityCounter: number = 0;
  private idleCounter: number = 0;
  private idleCheckTimerRef: any;
  private idleEvent: Subject<void> = new Subject();
  showSessionExpiryDialogSecs = 30;
  showCountDownTimerSecs = 30;
  ngOnInit(): void {
    const data = this.gs.getUserToken();
    // this.timeoutvalue = data[0].timeout * 60;
    this.timeoutvalue = data[0].timeout * 60;
    this.timeLeft = this.timeoutvalue;
    this.showtimer();
    //document.addEventListener('mousemove', this.resetTimer, false);
    // document.addEventListener('keypress', this.resetTimer, false);
    // document.addEventListener('click', this.resetTimer, false);
    // document.addEventListener('touchmove', this.resetTimer, false);
    this.startWatchingEvent(1);
  }
  // showtimer(): void {
  //   let textSec: any = '0';
  //   let statSec: number = 60;
  //   this.display = '';
  //   statSec = 60;
  //   this.timeLeft = 0;
  //   this.timeLeft = this.timeoutvalue;
  //   const prefix = this.timeLeft < 10 ? '0' : '';
  //   this.interval = setInterval(() => {
  //       this.timeLeft--;
  //       if (statSec !== 0) {
  //         statSec--;
  //       }
  //       else{
  //           statSec = 59;
  //         }

  //       if (statSec < 10) {
  //         textSec = '0' + statSec;
  //       } else {
  //         textSec = statSec;
  //       }
  //       if (this.timeLeft <= 120) {
  //         this.display = `${prefix}${Math.floor(this.timeLeft / 60)}:${textSec}`;

  //       }
  //       if (this.timeLeft === 120) {

  //         const timerbutton = document.getElementById('timerId');
  //         timerbutton.click();
  //       }
  //       if (this.timeLeft === 1) {
  //         clearInterval(this.interval);
  //         this.dialog.closeAll();
  //         this.logout();
  //       }
  //   }, 1000);

  // }

  showtimer(): void {
    let textSec: any = '0';
    let statSec = 60;
    this.display = '';
    statSec = 60;
    this.timeLeft = 0;
    this.timeLeft = this.timeoutvalue;
    const prefix = this.timeLeft < 10 ? '0' : '';
    this.interval = setInterval(() => {
      this.timeLeft--;
      if (statSec !== 0) {
        statSec--;
      } else {
        statSec = 59;
      }

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else {
        textSec = statSec;
      }
      /* To show modal after this time */
      if (this.timeLeft === this.showSessionExpiryDialogSecs) {
        const timerbutton: any = document.getElementById('timerId');
        timerbutton.click();
      }
      /* Provide number of seconds to display Timer value */
      if (this.timeLeft <= this.showCountDownTimerSecs) {
        this.display = `${prefix}${Math.floor(
          this.timeLeft / 60
        )} min ${textSec} secs`;
      }

      if (this.timeLeft === 1) {
        clearInterval(this.interval);
        this.dialog.closeAll();
        this.logout();
        // this.logOutUser();
      }
    }, 1000);
  }
  openTimerDialog(openTimer: any): any {
    this.dialog.open(openTimer, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 60px)',
      disableClose: true,
    });
  }
  public startWatchingEvent(timeToDetectIdleInMinutes: number): Subject<void> {
    this.detachEventListeners();
    this.attachEventListeners(timeToDetectIdleInMinutes);
    return this.idleEvent;
  }

  detachEventListeners(): void {
    if (this.idleEvent) {
      this.idleEvent.complete();
    }
    clearInterval(this.idleCheckTimerRef);
    this.EVENT_WATCH_LIST.forEach((eventName) => {
      window.removeEventListener(eventName, this.onActivity.bind(this));
    });
  }

  ngOnDestroy(): void {
    this.detachEventListeners();
  }

  private attachEventListeners(timeToDetectIdleInMinutes: number): void {
    if (this.idleEvent) {
      this.idleEvent.complete();
      this.idleEvent = new Subject();
    }
    this.idleCounterTarget = timeToDetectIdleInMinutes;
    this.EVENT_WATCH_LIST.forEach((eventName) => {
      window.addEventListener(eventName, this.onActivity.bind(this));
    });
    this.idleCheckTimerRef = setInterval(
      this.onIdleCheck.bind(this),
      this.CHECK_FREQUENCY_MS
    );
  }

  private onIdleCheck(): void {
    if (this.eventActivityCounter === 0) {
      this.idleCounter++;
      if (
        this.idleCounterTarget !== undefined &&
        this.idleCounter >= this.idleCounterTarget
      ) {
        setTimeout(() => {
          this.idleEvent.next();
          // Note that this will continue to fire every minute
          // the consumer might want to consume it with take(1)
        });
      }
      // wait for more idle
      return;
    }
    this.eventActivityCounter = 0;
    this.idleCounter = 0;
  }

  private onActivity(): void {
    this.timeLeft = 0;
    this.timeLeft = this.timeoutvalue;
  }

  resetTimer(): void {
    console.log('reset', this.interval);
    clearInterval(this.interval);
    this.showtimer();
    this.dialog.closeAll();
  }
  logout(): any {
    const body = {};
    this.dialog.closeAll();
    this.gs.logout(body).subscribe(
      (res) => {
        this.onSuccessslogout(res);
      },
      (err) => {
        this.onErrorrLogout(err);
      }
    );
  }
  onSuccessslogout(data: any): any {
    sessionStorage.removeItem('appVizUrl');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('chatData');
    this.router.navigateByUrl('auth/login');
    this.router
      .navigateByUrl('auth/login', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['auth/login']);
      });
    window.location.reload();
  }
  onErrorrLogout(err: any): any {
    sessionStorage.removeItem('appVizUrl');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('roles');
    sessionStorage.removeItem('chatData');
    this.router.navigateByUrl('auth/login');
    this.router
      .navigateByUrl('auth/login', { skipLocationChange: true })
      .then(() => {
        this.router.navigate(['auth/login']);
      });
    window.location.reload();
  }
  onErrorr(error: any): any {
    Swal.fire({
      icon: 'error',
      text: error,
    });
  }
}
// var idleTime = 0
// function checkIfIdle ()
// {
//   idleTime += 1000
//   console.log(idleTime)
//   if (idleTime >= 10000)
//   {
//     alert("Inactive for 5 seconds")
//     clearInterval(idleInterval)
//   }
// }

// var idleInterval = setInterval(checkIfIdle, 1000);
