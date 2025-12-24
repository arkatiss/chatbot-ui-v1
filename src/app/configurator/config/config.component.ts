import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ConfigService } from '../service/config.service';
import { CommonService } from '../../helper/common.service';
import { PagesService } from '../../pages/pages.service';
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
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
})
export class ConfigComponent implements OnInit {
  imgurl: any;
  imageURL: any = environment.imageUrl;
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

  collapsed = false;
  activeParent: NavItem | null = null;
  activeChild: NavItem | null = null;

  navItems: NavItem[] = [
    {
      label: 'Domain',
      icon: 'fa-solid fa-diagram-project',
      children: [
        {
          label: 'Create',
          route: '/config/createdomain',
          icon: 'fa-solid fa-circle-plus',
        },
        { label: 'View', route: '/config/viewdomain', icon: 'fa-solid fa-eye' },
      ],
    },
    {
      label: 'Infoset',
      icon: 'fa-solid fa-folder',
      children: [
        {
          label: 'Create',
          route: '/config/infoset',
          icon: 'fa-solid fa-circle-plus',
        },
        // {
        //   label: 'Create',
        //   route: '/config/createinfoset',
        //   icon: 'fa-solid fa-circle-plus',
        // },
        {
          label: 'View',
          route: '/config/viewinfoset',
          icon: 'fa-solid fa-eye',
        },
      ],
    },
    // {
    //   label: 'Data Auth',
    //   icon: 'fa-solid fa-shield-halved',
    //   children: [
    //     {
    //       label: 'Create',
    //       route: '/config/dataauthcreate',
    //       icon: 'fa-solid fa-circle-plus',
    //     },
    //     {
    //       label: 'View',
    //       route: '/config/viewdataauth',
    //       icon: 'fa-solid fa-eye',
    //     },
    //   ],
    // },
    {
      label: 'Training',
      icon: 'fa-solid fa-book-journal-whills',
      children: [
        {
          label: 'New App On Boarding',
          route: '/config/createtraining',
          icon: 'fa-solid fa-rocket',
        },
        {
          label: 'Failed Utterances',
          route: '/config/training',
          icon: 'fa-solid fa-triangle-exclamation',
        },
      ],
    },
    {
      label: 'Configurations',
      icon: 'fa-solid fa-gear',
      children: [
        {
          label: 'Create',
          route: '/config/configurations',
          icon: 'fa-solid fa-circle-plus',
        },
        { label: 'View', route: '/config/training', icon: 'fa-solid fa-eye' },
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
