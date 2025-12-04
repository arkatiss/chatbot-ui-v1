import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../login/service/login.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss'],
})
export class ForbiddenComponent implements OnInit {
  constructor(private router: Router, private api: LoginService) {}

  ngOnInit(): void {}
  logout(): any {
    const body = {};
    this.api.logout(body).subscribe(
      (res: any) => {
        this.onSuccessslogout(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessslogout(data: any): any {
    if (data.res_status === true) {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('roles');
      sessionStorage.removeItem('chatData');
      sessionStorage.removeItem('appVizUrl');
      this.router.navigateByUrl('auth/login');
      this.router
        .navigateByUrl('auth/login', { skipLocationChange: true })
        .then(() => {
          this.router.navigate(['auth/login']);
        });
      window.location.reload();
    } else {
      sessionStorage.removeItem('appVizUrl');
      Swal.fire({
        icon: 'error',
        text: data.msg,
      });
    }
  }
  onErrorr(error: any): any {
    sessionStorage.removeItem('appVizUrl');
    Swal.fire({
      icon: 'error',
      text: error,
    });
  }
}
