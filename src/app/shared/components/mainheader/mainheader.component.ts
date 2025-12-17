import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  HostListener,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { PagesService } from '../../../pages/pages.service';
import { MessagingService } from '../../../service/messaging.service';
import { GeneralService } from '../../../helper/general.service';
import { ApicallService } from '../../../pages/apiservice/apicall.service';
import { environment } from '../../../../environments/environment';
// import { MessagingService } from 'src/app/service/messaging.service';
// import { GeneralService } from 'src/app/helper/general.service';
// import { environment } from 'src/environments/environment';
// import { ApicallService } from 'src/app/pages/apiservice/apicall.service';
// import { PagesService } from 'src/app/pages/pages.service';
type AOA = any[][];

@Component({
  selector: 'app-mainheader',
  templateUrl: './mainheader.component.html',
  styleUrls: ['./mainheader.component.scss'],
})
export class MainheaderComponent implements OnInit {
  userName: any;
  imgurl: any;
  iconUrl: any;
  hidedashboard = true;
  showdashboard = false;
  showtoggle = true;
  elastickeyword: any;
  docsdata: any;
  flag: any;
  userNotifications: any[] = [];
  agentchatenabled = false;
  searchbtncolor;
  location;
  loginFullName: any;
  constructor(
    private router: Router,
    private pageservice: PagesService,
    @Inject(DOCUMENT) private document: Document,
    private spinner: NgxSpinnerService,
    private msgservice: MessagingService,
    private gs: GeneralService,
    private api: ApicallService,
    private cdr:ChangeDetectorRef
  ) {
    const imgUrl = this.gs.getPropertiesUrl();

    this.imgurl = imgUrl.imgPath;
    this.location = router.url;
    if (this.imgurl.includes('cs') === true) {
      this.searchbtncolor = '#d92337';
    } else {
      this.searchbtncolor = '#737373';
    }
    this.iconUrl = environment.iconUrl;
  }
  @ViewChild('sidenav') sidenav: MatSidenav | any;
  clrcode: any;
  showuserstatus = false;
  notificationData: any[] = [];
  notificationClass: any;
  userRole: any;
  notarray: any[] = [];
  agentNormalNotification: any[] = [];
  selectedUserChat: any;
  showGridComponent = false;
  elasticData: any;
  showSelector = 'showMainComponent';
  hideGrid = true;
  timeoutvalue: number | any;
  @Output() hideChat = new EventEmitter();
  @Output() moveToSelectedTab = new EventEmitter();
  @Output() acceptedData = new EventEmitter();
  acceptedAgentList: any[] = [];
  totalUsersList: any[] = [];
  UserFirstLtr: any;
  ngOnInit(): void {
    this.getRoles();
    this.msgservice.recievedCloudMessage().subscribe((info: any) => {
      if (info !== undefined && info !== null) {
        if (
          info.data.is_updated === 'true' &&
          (info.data.peer_flag === 1 || info.data.peer_flag === '1')
        ) {
        } else if (
          (info.data.is_typing === 'true' || info.data.is_typing === 'false') &&
          (info.data.peer_flag === 1 || info.data.peer_flag === '1')
        ) {
        } else if (
          info.data.is_transfer === 'true' &&
          info.data.body === 'request'
        ) {
          this.notificationData = [];
          this.userNotifications = [];
          this.notarray.push(info.data);
          this.getNotificationsData();
        } else {
          this.pageservice.getStatusUser().subscribe((chatuser: any) => {
            if (chatuser !== undefined && chatuser !== null) {
              this.selectedUserChat = chatuser;
            }
          });
          this.pageservice.getAgentStatus().subscribe((chatuser: any) => {
            if (chatuser !== undefined && chatuser !== null) {
              this.agentchatenabled = chatuser;
            }
          });
          if (this.selectedUserChat === info.data.sender_name) {
          } else if (this.agentchatenabled === true) {
          } else {
            this.notificationData = [];
            this.userNotifications = [];
            this.notarray.push(info.data);
            this.getNotificationsData();
          }
        }
      }
      this.cdr.detectChanges();
    });
    this.pageservice.getShowView().subscribe((info: any) => {
      if (info !== undefined && info !== null) {
        if (Object.keys(info).length > 0) {
          this.showSelector = info;
          if (info === 'showGridComponent' || info === 'showAllocGrid') {
            this.showGridComponent = true;
            this.hideGrid = false;
          } else {
            this.showGridComponent = false;
            this.hideGrid = true;
          }
        }
      }
    });
    this.pageservice.getAllUsersData().subscribe((info: any) => {
      if (info !== undefined && info !== null) {
        if (Object.keys(info).length > 0) {
          this.totalUsersList = info;
          this.getNotifications();
        }
      }
    });
    this.changeTheme('#7ea3e0');
    const data = this.gs.getUserToken();
    this.userName = data[0].user_name;
    if (data[0].name === '' || data[0].name === undefined) {
      this.loginFullName = data[0].user_name.split('@')[0];
    } else {
      this.loginFullName = data[0].name;
    }
    this.userStatus();
    const str = this.loginFullName;
    const matches = str.match(/\b(\w)/g);
    this.UserFirstLtr = matches.join('').toUpperCase();
  }
  getNotifications(): any {
    const body = { peer_type: 'count' };
    this.api.sendMessage(body).subscribe(
      (res: any) => {
        this.onSuccesNotification(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesNotification(data: any): any {
    if (data.res_status === true) {
      this.notificationData = [];
      this.userNotifications = [];
      this.notificationData = data.data;
      if (this.notificationData.length > 0) {
        for (let i = 0; i < this.notificationData.length; i++) {
          const username = Object.keys(this.notificationData[i]);
          if (username[0] === this.userName) {
            const values = Object.values(this.notificationData[i]);
            const notifyData: any[] = [];
            notifyData.push(values[0]);
            for (let b = 0; b < notifyData[0].length; b++) {
              for (let j = 0; j < notifyData[0][b].count; j++) {
                this.notarray.push({
                  peer_chat_type: notifyData[0][b].type,
                  sender_name: notifyData[0][b].user_name,
                });
              }
            }
            this.getNotificationsData();
          }
        }
      }
    } else {
      this.notificationClass = '';
    }
    this.cdr.detectChanges();
  }
  getNotificationsData(): any {
    let normalchatarray: any[] = [];
    let agentchatarray: any[] = [];
    // const userData = [];
    // const loginFullName = [];
    const agentObj = {};
    // for (const notarr of this.notarray ){
    //   if (notarr.peer_chat_type === 'normal') {
    //     normalchatarray.push(notarr.sender_name);
    //   }else{
    //     Object.assign(agentObj, {senderName: notarr.sender_name});
    //     if (notarr.user_data) {
    //       Object.assign(agentObj, {userData: notarr.user_data});
    //     }else {

    //     }
    //     if (notarr.name) {
    //       Object.assign(agentObj, {loginFullName: notarr.name});
    //     }
    //     if (notarr.is_transfer === 'true' && notarr.body === 'request') {
    //       Object.assign(agentObj, {is_transfer: true});
    //     }
    //     agentchatarray.push(agentObj);
    //   }
    // }
    for (let a = 0; a < this.notarray.length; a++) {
      if (this.notarray[a].peer_chat_type === 'normal') {
        normalchatarray.push(this.notarray[a].sender_name);
      } else {
        Object.assign(agentObj, { senderName: this.notarray[a].sender_name });
        if (this.notarray[a].user_data) {
          Object.assign(agentObj, { userData: this.notarray[a].user_data });
        } else {
        }
        if (this.notarray[a].name) {
          Object.assign(agentObj, { loginFullName: this.notarray[a].name });
        }
        if (
          this.notarray[a].is_transfer === 'true' &&
          this.notarray[a].body === 'request'
        ) {
          Object.assign(agentObj, { is_transfer: true });
        }
        agentchatarray.push(agentObj);
      }
    }
    const mySet = new Set(normalchatarray);
    normalchatarray = [...mySet];
    const mySet2 = new Set(agentchatarray);
    agentchatarray = [...mySet2];
    const normalcount: any = {};
    const agentcount: any = {};
    const name = {};
    if (normalchatarray.length > 0) {
      for (let i = 0; i < normalchatarray.length; i++) {
        for (let b = 0; b < this.notarray.length; b++) {
          if (
            normalchatarray[i] === this.notarray[b].sender_name &&
            this.notarray[b].peer_chat_type === 'normal'
          ) {
            if (normalcount[normalchatarray[i]] === undefined) {
              normalcount[normalchatarray[i]] = 1;
            } else {
              normalcount[normalchatarray[i]] =
                normalcount[normalchatarray[i]] + 1;
            }
          }
        }
        this.agentNormalNotification.map((item, index) => {
          if (item.email === normalchatarray[i] && item.type === 'normal') {
            this.agentNormalNotification.splice(index, 1);
          }
        });
        let fullName;
        this.totalUsersList.map((item: any) => {
          if (item.user_name === normalchatarray[i]) {
            fullName = item.name;
          }
        });
        if (fullName === undefined) {
          fullName = normalchatarray[i].split('@')[0];
        }
        this.agentNormalNotification.push({
          email: normalchatarray[i],
          count: normalcount[normalchatarray[i]],
          type: 'normal',
          user_name: fullName,
        });
      }
    }
    // this.notarray.map((item,i) => {
    //   if (item.peer_chat_type === 'agent' && item.is_transfer === true && item.body === 'request') {
    //     item.splice(i,1);
    //   }
    // });
    if (agentchatarray.length > 0) {
      for (let i = 0; i < agentchatarray.length; i++) {
        for (let b = 0; b < this.notarray.length; b++) {
          if (
            agentchatarray[i].senderName === this.notarray[b].sender_name &&
            this.notarray[b].peer_chat_type === 'agent'
          ) {
            if (agentcount[agentchatarray[i].senderName] === undefined) {
              agentcount[agentchatarray[i].senderName] = 1;
            } else {
              agentcount[agentchatarray[i].senderName] =
                agentcount[agentchatarray[i].senderName] + 1;
            }
          }
        }
        this.agentNormalNotification.map((item, index) => {
          if (item.email === agentchatarray[i] && item.type === 'agent') {
            this.agentNormalNotification.splice(index, 1);
          }
        });
        const confirmationButtons = ['Accept', 'Reject'];
        if (
          agentchatarray[i].loginFullName !== undefined &&
          agentchatarray[i].is_transfer === true
        ) {
          this.agentNormalNotification.push({
            email: agentchatarray[i].senderName,
            type: 'agent',
            confirmButton: confirmationButtons,
            user_data: agentchatarray[i].userData,
            agType: 'request',
            name: agentchatarray[i].loginFullName,
            user_name: agentchatarray[i].senderName.split('@')[0],
          });
          this.notarray.map((item, i) => {
            if (
              item.peer_chat_type === 'agent' &&
              item.is_transfer === true &&
              item.body === 'request'
            ) {
              item.splice(i, 1);
            }
          });
        }
      }
      this.notarray.map((item, i) => {
        if (
          item.peer_chat_type === 'agent' &&
          item.is_transfer === true &&
          item.body === 'request'
        ) {
          item.splice(i, 1);
        }
      });
    }
    this.cdr.detectChanges();
  }

  acceptRequest(status: any, totObj: any): void {
    this.notarray.map((item, i) => {
      if (
        item.peer_chat_type === 'agent' &&
        item.is_transfer === true &&
        item.body === 'request'
      ) {
        item.splice(i, 1);
      }
    });
    const idxId = this.agentNormalNotification.findIndex(
      (i) => i.email === totObj.email
    );
    this.agentNormalNotification.splice(idxId, 1);
    if (status.toLowerCase() === 'accept') {
      const obj: any = {
        username: totObj.email,
        user: totObj.user_name,
        typeofUser: totObj.type,
        userData: totObj.user_data,
        loginFullName: totObj.name,
      };
      this.acceptedAgentList.push(obj);
      for (let j = 0; j < this.notarray.length; j++) {
        if (
          this.notarray[j].sender_name === obj.username &&
          this.notarray[j].peer_chat_type === obj.typeofUser
        ) {
          this.notarray.splice(j, 1);
        }
      }
      this.moveToSelectedTab.emit('agent');
      this.acceptedData.emit(this.acceptedAgentList);
    } else {
      const obj = {
        username: totObj.email,
        user: totObj.user_name,
        typeofUser: totObj.type,
        userData: totObj.user_data,
        loginFullName: totObj.name,
      };
      //this.acceptedAgentList.push(obj);
      for (let j = 0; j < this.notarray.length; j++) {
        if (
          this.notarray[j].sender_name === obj.username &&
          this.notarray[j].peer_chat_type === obj.typeofUser
        ) {
          this.notarray.splice(j, 1);
        }
      }
      this.updateSupportGroup();
    }
    this.statusOfAcceptReject(status.toLowerCase(), totObj);
  }
  statusOfAcceptReject(status: any, totObj: any): void {
    const body = {
      peer_type: 'transfer',
      sender_name: this.userName,
      receiver_name: totObj.email,
      peer_chat_type: 'agent',
      input: status,
      user_data: JSON.stringify(status),
      name: this.loginFullName,
    };
    this.api.sendMessage(body).subscribe(
      (res: any) => {
        this.onsuccessRequestAgent(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onsuccessRequestAgent(data: any): void {
    if (data.res_status === true) {
    }
  }
  updateSupportGroup(): any {
    const body = { support_user: this.userName, chat_flag: 0 };
    this.api.updateSupportGroup(body).subscribe(
      (res: any) => {
        this.onSuccesssUpdateSupportStatus(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssUpdateSupportStatus(data: any): void {}
  cancelRequest(): any {
    this.spinner.hide();
  }
  userStatus(): any {
    const body = {};
    this.api.userStatus(body).subscribe(
      (res: any) => {
        this.onSuccessStatus(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessStatus(data: any): any {
    this.showuserstatus = true;
    this.flag = data.data.chat_flag;
  }
  updateUserStatus(flag: any): any {
    this.spinner.show();
    const data = this.gs.getUserToken();
    const userName = data[0].user_name;
    const body = { support_user: userName, chat_flag: flag };
    this.api.updateUserStatus(body).subscribe(
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
  history(): any {
    this.pageservice.setShowView('historyView');
  }
  gotoView(val: any): any {
    this.pageservice.setShowView(val);
    this.navigateTo('/pages/main');
  }
  onErrorr(error: any): any {
    this.spinner.hide();
  }
  logout(): any {
    const body = {};
    this.api.logout(body).subscribe(
      (res: any) => {
        this.onSuccessslogout(res);
      },
      (err: any) => {
        this.onErrorrLogOut(err);
      }
    );
  }
  onSuccessslogout(data: any): any {
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
  }
  onErrorrLogOut(data: any): any {
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
  }
  changeTheme(primary: any): any {
    this.clrcode = primary;
    document.documentElement.style.setProperty('--primary-color', primary);
  }

  chatwindow(data: any): any {
    this.pageservice.setWindow(data);
    this.router.navigateByUrl('/pages/home');
  }
  cancel(): any {
    this.spinner.hide();
    //this.common.http.cancelCall();
  }
  switchonChange(enable: boolean, evt: any): any {
    this.pageservice.switchData(enable);
  }
  dashboard(val: any, event: any): any {
    event.stopPropagation();
    this.pageservice.setDashboard(val);
    if (val === 'hide') {
      this.hidedashboard = false;
      this.showdashboard = true;
    } else {
      this.hidedashboard = true;
      this.showdashboard = false;
    }
  }
  collapseDiv(val: any): any {
    this.hideChat.emit(val);
    this.showtoggle = !this.showtoggle;
  }
  elasticSearch(): any {
    this.spinner.show();
    const body = { search_string: 'vendorportal/' + this.elastickeyword };
    this.api.elasticSearch(body).subscribe(
      (res: any) => {
        this.onSuccesselasticSearch(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesselasticSearch(data: any): any {
    this.docsdata = data;
    const obj = { data: this.docsdata, keyword: this.elastickeyword };
    this.elasticData = obj;
    this.pageservice.setShowView('elasticDoc');
    this.pageservice.setDocsData(obj);
    this.spinner.hide();
  }

  openChat(val: any, i: any): any {
    if (val.type === 'agent') {
      this.agentchatenabled = true;
    } else {
      this.agentchatenabled = false;
    }
    const obj = {
      username: val.email,
      user: val.user_name,
      typeofUser: val.type,
    };
    const idxId = this.agentNormalNotification.findIndex(
      (i) => i === val.email
    );
    this.agentNormalNotification.splice(idxId, 1);
    for (let j = 0; j < this.notarray.length; j++) {
      if (
        this.notarray[j].sender_name === obj.username &&
        this.notarray[j].peer_chat_type === obj.typeofUser
      ) {
        this.notarray.splice(j, 1);
      }
    }
    this.pageservice.setOpenChat(obj);
  }
  navigateTo(val: any): any {
    this.router.navigateByUrl('/' + val + '');
  }

  getRoles(): void {
    const body = {};
    this.api.getRoles(body).subscribe(
      (res: any) => {
        this.onSuccessRoles(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessRoles(data: any): any {
    if (data.res_status === true) {
      // this.roledata = data.data;
      this.userRole = data.data;
      this.gs.setShowAgent(data.domain);
      this.gs.setUserRoleData(data.data);
      // sessionStorage.setItem('roles', this.roledata);
    }
  }
}
