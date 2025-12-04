import { AuthService } from './../auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { LoginService } from './service/login.service';
import { TempStorage } from '../../pages/charts/modal/charts-modal';
import { GeneralService } from '../../helper/general.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup | any;
  signupForm: FormGroup | any;
  imgurl: any;
  hide = true;
  isLoading = false;
  showprogressbar = true;
  private roledata: any;
  private loginToken: any;
  showloginform = true;
  showsignupform = false;
  logintext = 'sign in';
  showchatbot = false;
  showcsbot = false;
  margin: any;
  imgHeight: any;
  constructor(
    public authService: AuthService,
    private router: Router,
    public formBuilder: FormBuilder,
    private gs: GeneralService,
    private ls: LoginService
  ) {
    //  this.mes.getPermission().subscribe(info=>{
    //    console.log(currenttoken);
    //   debugger
    //    if(info !==null) {
    //     this.loginToken = info;
    //    }
    //  });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
    this.signupForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
    });
    const imgUrl = this.gs.getPropertiesUrl();
    this.imgurl = imgUrl?.imgPath;
    if (this.imgurl.includes('cs') === true) {
      this.showchatbot = false;
      this.showcsbot = true;
      this.margin = '20%';
      this.imgHeight = '50px';
    } else {
      this.showchatbot = true;
      this.showcsbot = false;
      this.margin = '30%';
      this.imgHeight = '';
    }
  }
  login(): any {
    if (this.loginForm.valid) {
      const token: any = sessionStorage.getItem('fcmToken');
      const fcmToken = JSON.parse(token);
      this.loginToken = fcmToken;
      this.isLoading = true;
      let userName;
      if (this.loginForm.value.username.includes('@cswg.com')) {
        userName = this.loginForm.value.username;
      } else if (this.loginForm.value.username.includes('@arkatiss.com')) {
        userName = this.loginForm.value.username;
      } else {
        userName = this.loginForm.value.username + '@cswg.com';
      }
      const body = {
        user_name: userName,
        password: btoa(this.loginForm.value.password),
        fcm_token: fcmToken,
        context: {
          'user-agent': {
            browser: this.getBrowserName(),
            browser_version: this.getBrowserVersion(),
          },
          'user-interface': 'web-ui',
        },
      };
      this.ls.login(body).subscribe(
        (res: any) => {
          this.onSuccessslogin(res);
        },
        (err: any) => {
          this.onErrorr(err);
        }
      );
    } else {
      this.validateAllFields(this.loginForm);
    }
  }
  onSuccessslogin(data: any): any {
    if (data.res_status === true) {
      let arr = [];
      arr = data.data;
      const sessionValue = [];
      for (const i of arr) {
        sessionValue.push({
          user_id: i.user_id,
          user_name: i.user_name,
          session_id: i.session_id,
          timeout: i.timeout,
          name: i.name,
        });
      }
      const token = JSON.stringify(sessionValue);
      this.gs.setUserToken(token);

      // sessionStorage.setItem('user', token);
      //this.router.navigateByUrl('/pages/home');

      const json = sessionStorage.getItem('appVizUrl');
      if (json?.includes('type=app_viz') === true) {
        this.router.navigate(['security/apps']);
      } else {
        this.router.navigateByUrl('/pages/home');
      }
    } else {
      this.isLoading = false;
      Swal.fire({
        icon: 'error',
        text: data.msg,
      });
    }
  }
  validateAllFields(formGroup: FormGroup): any {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
        Swal.fire({
          icon: 'error',
          text: field,
        });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }
  onErrorr(error: any): any {
    this.isLoading = false;
    Swal.fire({
      icon: 'error',
      text: error.msg,
    });
  }

  showsignup(): any {
    // this.showsignupform  = true;
    // this.showloginform = false;
    // this.logintext = 'sign up';
  }
  showlogin(): any {
    this.showsignupform = false;
    this.showloginform = true;
    this.logintext = 'sign in';
  }

  signup(): any {
    if (this.signupForm.valid) {
      this.isLoading = true;
      // console.log(this.signupForm.value);

      const success = this.onSuccessssignup.bind(this);
      const error = this.onErrorr.bind(this);
      const body = {
        user_auth_type: 'insert',
        json_data: this.signupForm.value,
      };
      // this.common.http.getLog('user_authentication', body, success, error);
      // of(this.showprogressbar).pipe(delay(100));
      // this.isLoading = true;
    } else {
      this.validateAllFields(this.signupForm);
    }
  }
  onSuccessssignup(data: any): any {
    if (data.res_status === true) {
      Swal.fire({
        icon: 'success',
        text: data.msg,
      });
      this.signupForm.reset();
      this.showsignupform = false;
      this.showloginform = true;
      this.logintext = 'sign in';
    }
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
    let userAgent = navigator.userAgent,
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

      if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }

    matchTest = matchTest[2]
      ? [matchTest[1], matchTest[2]]
      : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = userAgent.match(/version\/(\d+)/i)) != null) {
      matchTest.splice(1, 1, tem[1]);
    }

    return matchTest.join(' ');
  }
}
