import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConfigService } from '../service/config.service';
import { CommonService } from '../../helper/common.service';
import { PagesService } from '../../pages/pages.service';
import { GeneralService } from '../../helper/general.service';
import { ErrorService } from '../../helper/error.service';
@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  imgurl: any;
  userName;
  flag: any;
  showuserstatus = false;
  userRole;
  constructor(
    public spinner: NgxSpinnerService,
    private common: CommonService,
    private pageservice: PagesService,
    private router: Router,
    private gs: GeneralService,
    private cs: ConfigService,
    private error: ErrorService
  ) {
    this.userRole = this.gs.getUserRoleData();
    const data = this.gs.getUserToken();
    this.userName = data[0].user_name;
  }

  ngOnInit(): void {
    // this.imgurl = environment.imageUrl;
    const imgUrl = this.gs.getPropertiesUrl();
    this.imgurl = imgUrl.imgPath;
    this.userStatus();
  }
  cancel(): any {
    this.spinner.hide();
    this.common.http.cancelCall();
  }
  gotoView(val: any): any {
    this.router.navigateByUrl('pages/main');
    this.pageservice.setShowView(val);
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  openChat(): any {
    // console.log(val);
    const obj = {};
    this.pageservice.setOpenChat(obj);
    this.router.navigateByUrl('/pages/main');
  }
  userStatus(): any {
    const body = {};
    this.cs.userStatus(body).subscribe(
      (res: any) => {
        this.onSuccessStatus(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessStatus(data: any): any {
    if (data.res_status === true) {
      this.showuserstatus = true;
      this.flag = data.data.chat_flag;
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }

  updateUserStatus(flag: any): any {
    this.spinner.show();
    const body = { support_user: this.userName, chat_flag: flag };
    this.cs.updateUserStatus(body).subscribe(
      (res: any) => {
        this.onSuccesssUpdatesupport(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssUpdatesupport(data: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'success',
      text: 'status updated successfully',
    });
    this.userStatus();
  }
}
