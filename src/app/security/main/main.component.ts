import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { SecurityService } from '../service/security.service';
import { CommonService } from '../../helper/common.service';
import { GeneralService } from '../../helper/general.service';
import { ErrorService } from '../../helper/error.service';
import { environment } from '../../../environments/environment';

interface NavItem {
  label: string;
  icon: string;
  route?: string;
  children?: NavItem[];
}
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  imgurl: any;
  imageURL: any = environment.imageUrl;
  userName: any;
  flag: any;
  showuserstatus = false;
  userNames: any[] = [];
  domainDetails: any[] = [];
  userRole: any;
  fullname: any;
  hideDashBoard = true;
  constructor(
    public spinner: NgxSpinnerService,
    private common: CommonService,
    private router: Router,
    private gs: GeneralService,
    private ss: SecurityService,
    private error: ErrorService
  ) {
    this.getuserNames();
    this.retrieveDomain();
  }

  ngOnInit(): void {
    this.gs.gethideDashBoard().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info.flag === 'hide') {
          this.hideDashBoard = false;
        }
      }
    });
    this.gs.getUserRoleData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          this.userRole = info;
        } else {
        }
      }
    });

    const imgUrl = this.gs.getPropertiesUrl();
    this.imgurl = imgUrl.imgPath;
    const data = this.gs.getUserToken();
    this.userName = data[0].user_name;
    this.fullname = data[0].name;
    this.userStatus();
  }
  cancel(): any {
    this.spinner.hide();
    this.common.http.cancelCall();
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }

  userStatus(): any {
    const body = {};
    this.ss.userStatus(body).subscribe(
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
    this.ss.updateUserStatus(body).subscribe(
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
  getuserNames(): any {
    this.spinner.show();
    const body = {};
    this.ss.getActiveUsers(body).subscribe(
      (res: any) => {
        this.onSuccessuserNames(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessuserNames(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      const users = data.data;
      this.userNames = [];
      for (const a of users) {
        //const user = a.name.split('@');
        // const userName = user[0];
        this.userNames.push({
          email: a.user_name,
          name: a.name,
          status: a.status,
          chatFlag: a.chat_flag,
          chatStatus: a.chat_flag_status,
        });
      }
      this.userNames = this.getUnique(this.userNames, 'email');
      this.userNames.push({ email: this.userName, name: this.fullname });
      this.ss.setUsersData(this.userNames);
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  getUnique(arr: any, comp: any): any {
    const unique = arr
      .map((e: any) => e[comp])
      .map((e: any, i: any, final: any) => final.indexOf(e) === i && i)
      .filter((e: any) => arr[e])
      .map((e: any) => arr[e]);
    return unique;
  }

  retrieveDomain(): any {
    const body = { chat_bot_type: 'retrieve' };
    this.ss.addDomain(body).subscribe(
      (res: any) => {
        this.onSuccesssRetDomain(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }

  onSuccesssRetDomain(data: any): any {
    if (data.res_status === true) {
      data.domains.push('General');
      this.domainDetails = data.data;
      this.ss.setDomainsData(this.domainDetails);
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }

  collapsed = false;
  activeParent: NavItem | null = null;
  activeChild: NavItem | null = null;

  navItems: NavItem[] = [
    {
      label: 'Roles',
      icon: 'fa-solid fa-user-shield',
      children: [
        {
          label: 'Create',
          route: '/security/createrole',
          icon: 'fa-solid fa-circle-plus',
        },
        {
          label: 'View',
          route: '/security/viewrole',
          icon: 'fa-solid fa-eye',
        },
      ],
    },
    {
      label: 'Support Group',
      icon: 'fa-solid fa-headset',
      children: [
        {
          label: 'Create',
          route: '/security/createsupport',
          icon: 'fa-solid fa-circle-plus',
        },
        {
          label: 'View',
          route: '/security/viewsupport',
          icon: 'fa-solid fa-eye',
        },
      ],
    },
    {
      label: 'Domain Mapping',
      icon: 'fa-solid fa-diagram-project',
      children: [
        {
          label: 'Create',
          route: '/security/createmaping',
          icon: 'fa-solid fa-circle-plus',
        },
        {
          label: 'View',
          route: '/security/viewmaping',
          icon: 'fa-solid fa-eye',
        },
      ],
    },
  ];

  currentOverlay: any;

  toggleSidebar() {
    this.collapsed = !this.collapsed;
  }

  selectParent(item: NavItem) {
    if (item.children) {
      this.activeParent = this.activeParent === item ? null : item;
    } else if (item.route) {
      this.activeParent = item;
      this.activeChild = null;
      this.router.navigate([item.route]);
    }
  }

  selectChild(parent: NavItem, child: NavItem) {
    this.activeParent = parent;
    this.activeChild = child;
    if (child.route) {
      this.router.navigate([child.route]);
    }
  }

  showOverlay(event: Event, item: any, overlay: any) {
    if (!item.children) return;

    // Close previously open overlay
    if (this.currentOverlay && this.currentOverlay !== overlay) {
      this.currentOverlay.hide();
    }

    this.currentOverlay = overlay;
    overlay.show(event);
  }

  onOverlayLeave(overlay: any) {
    overlay.hide();
  }

  navigateFromOverlay(parent: any, child: any, overlay: any) {
    this.selectChild(parent, child);
    overlay.hide();
  }
}
