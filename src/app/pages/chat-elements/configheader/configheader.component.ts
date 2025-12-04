import { Component, OnInit, ViewChild, Inject, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { DOCUMENT } from '@angular/common';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { MatSidenav } from '@angular/material/sidenav';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subject, Subscription } from 'rxjs';
import { CommonService } from 'src/app/helper/common.service';
import Swal from 'sweetalert2';
import { MessagingService } from 'src/app/service/messaging.service';
import { GeneralService } from 'src/app/helper/general.service';
import { environment } from 'src/environments/environment';
import { PagesService } from '../../pages.service';
import { ApicallService } from '../../apiservice/apicall.service';
type AOA = any[][];

@Component({
  selector: 'app-configheader',
  templateUrl: './configheader.component.html',
  styleUrls: ['./configheader.component.scss']
})
export class ConfigheaderComponent implements OnInit {
  today = new Date();
  todaysDataTime = '';
  CurrentTime: any;
  timestamp: string;
  enterbox = true;
  showarrow = false;
  cnt = 0;
  activeUsers = [];
  showperson = false;
  showperson2 = true;
  chatname;
  userName;
  timer = null;
  imgurl;
  iconUrl;
  destroy$: Subject<boolean> = new Subject<boolean>();
  chatnamedisplay: any;
  hidedashboard = true;
  showdashboard = false;
  hidetoggle = false;
  showtoggle = true;
  col3 = 'col-sm-4 col-md-4 col-lg-3 p-0 pl-3';
  col9 = 'col-sm-8 col-md-8 col-lg-9 ';
  elastickeyword;
  docsdata: any;
  flag;
  shortname: any;
  messages: Subject<any>;
  connected: Subscription;
  isConnected = false;
  websocketUrl: string;
  userNotifications: any[] = [];
  agentchatenabled = false;
  searchbtncolor;
  dashBoardWidth = '75%';
  chatWidth;
  constructor(private router: Router, private pageservice: PagesService, @Inject(DOCUMENT) private document: Document,
              private spinner: NgxSpinnerService, private common: CommonService, private msgservice: MessagingService,
              private gs: GeneralService, private api: ApicallService) {
    const time = new Date();
    const inputtime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    this.timestamp = inputtime;

    const imgUrl = this.gs.getPropertiesUrl();
  
    this.imgurl = imgUrl.imgPath;

    if (this.imgurl.includes('cs') === true ){
      this.searchbtncolor = '#d92337';
    }else{
      this.searchbtncolor = '#737373';
    }
    this.iconUrl = environment.iconUrl;
  }
  @ViewChild('sidenav') sidenav: MatSidenav;
  @HostListener('window:scroll', ['$event'])
  leftdata;
  mainuser;
  heading;
  notcurrent;
  currentshow;
  inputmsg;
  userId;
  msgdata;
  outputtype;
  keys;
  values;
  datamarkviewdata;
  valuess = [];
  apichatdata = [];
  apichatdata2 = [];
  outputreport = [];
  outputreportt = [];
  showfile = false;
  data: AOA = [[1, 2], [3, 4]];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'userchat.xlsx';
  queryVal: string;
  chatbgcolor = false;
  datamarkdata = [];
  suggetions = [];
  datetime: any;
  starthide = true;
  stophide = false;
  bgColor;
  json = [];
  chatdatalayouts = [];
  datevalue: any;
  sessionId: any;
  msg: any;
  datamarksdatewise = [];
  public dragging: boolean;
  showspinner = false;
  clrcode;
  open = true;
  close = false;
  abc;
  playValBoolean = false;
  playVal: any;
  pauseVal: any;
  playVal2 = [];
  showuserstatus = false;
  totalCount = 0;
  notificationData = [];
  notificationClass;
  userRole;
  notarray = [];
  agentNormalNotification = [];
  selectedUserChat;
  showGridComponent = false;
  elasticData;
  showSelector = 'showMainComponent';
  hideGrid = true;
  timeoutvalue: number;
  ngOnInit(): void {
    this.msgservice.recievedCloudMessage().subscribe(info => {
      if (info !== undefined && info !== null) {
        if (info.data['is_updated'] === 'true' && info.data['peer_flag'] === 1 || info.data['peer_flag'] === '1') {
        }else {
          this.pageservice.getStatusUser().subscribe(chatuser => {
            if (chatuser !== undefined && chatuser !== null) {
              this.selectedUserChat = chatuser;
            }
          });
          this.pageservice.getAgentStatus().subscribe(chatuser => {
            if (chatuser !== undefined && chatuser !== null) {
              this.agentchatenabled = chatuser;
            }
          });
          if (this.selectedUserChat === info.data['sender_name']) {
          }else if (this.agentchatenabled === true) {

          }else {
            this.notificationData = [];
            this.userNotifications = [];
           // this.notarray = [];
            // this.agentNormalNotification = [];
            this.notarray.push(info.data);
            this.getNotificationsData();
          }
        }
      }
  });
    this.pageservice.getShowView().subscribe(info => {
      if (info !== undefined && info !== null) {
        if (Object.keys(info).length > 0) {
        this.showSelector = info;
        if(info === 'showGridComponent' || info === 'showAllocGrid') {
          this.showGridComponent = true;
          this.hideGrid = false;
        }else {
          this.showGridComponent = false;
          this.hideGrid = true;
        }
       }
        
      }
  });
    //this.userRole =  this.gs.getUserRoleData();

    this.gs.getUserRoleData().subscribe(info => {
      if (Object.keys(info).length > 0) {
        if (info){
          this.userRole = info;
        }else{

        }
    }
    });
    this.changeTheme('#7ea3e0');
    this.getNotifications();
    this.pageservice.getChatData().subscribe(info => {
      if (info.length > 0) {
        this.apichatdata = info;
      }
    });
    const data = this.gs.getUserToken();
    this.userName = data[0].user_name;
    this.userStatus();
  }
  getNotifications(): any {
    const body = { peer_type: 'count'};
    this.api.sendMessage(body).subscribe(
      (res) => {
        this.onSuccesNotification(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );

  }
  onSuccesNotification(data): any {
    if (data.res_status === true) {
      this.notificationData = [];
      this.userNotifications = [];
      this.notificationData = data.data;
      if (this.notificationData.length > 0) {
        for (let i = 0; i < this.notificationData.length; i++) {
          const username = Object.keys(this.notificationData[i]);
          if (username[0] === this.userName) {
         const values  = Object.values(this.notificationData[i]);
         const notifyData = [];
         notifyData.push(values[0]);
            // this.agentNormalNotification.push({values});
         for (let b = 0; b < notifyData[0].length; b++){


         for (let j = 0; j < notifyData[0][b]['count']; j++){
            this.notarray.push({peer_chat_type: notifyData[0][b]['type'], sender_name: notifyData[0][b]['user_name']}) 
              }
        }
         this.getNotificationsData();
          }
        }
      }
    }
    else {
      this.notificationClass = '';
    }
  
  
  }
  getNotificationsData(): any {
    let normalchatarray = [];
    let agentchatarray = [];
    for (let a = 0; a < this.notarray.length; a++) {
      if (this.notarray[a].peer_chat_type === 'normal') {
        normalchatarray.push(this.notarray[a].sender_name);
      }else{
        agentchatarray.push(this.notarray[a].sender_name);
      }
    }
    const mySet = new Set(normalchatarray);
    normalchatarray = [...mySet];
    const mySet2 = new Set(agentchatarray);
    agentchatarray = [...mySet2];
    const normalcount = {};
    const agentcount = {};
    if (normalchatarray.length > 0) {
      for (let i = 0; i < normalchatarray.length; i++) {
        for (let b = 0; b < this.notarray.length; b++){
          if (normalchatarray[i] === this.notarray[b].sender_name && this.notarray[b].peer_chat_type === 'normal') {
            if (normalcount[normalchatarray[i]] === undefined){
              normalcount[normalchatarray[i]] = 1;
            }else {
              normalcount[normalchatarray[i]] = normalcount[normalchatarray[i]] + 1;
            }
          }
        }
        this.agentNormalNotification.map((item, index) => {
          if (item.email === normalchatarray[i] && item.type === 'normal') {
            this.agentNormalNotification.splice(index, 1);
          }
        });
        this.agentNormalNotification.push({email: normalchatarray[i], count: normalcount[normalchatarray[i]], type: 'normal',
        user_name: normalchatarray[i].split('@')[0]});
      }

    }
    if (agentchatarray.length > 0) {
      for (let i = 0; i < agentchatarray.length; i++) {
        for (let b = 0; b < this.notarray.length; b++){
          if (agentchatarray[i] === this.notarray[b].sender_name && this.notarray[b].peer_chat_type === 'agent') {
            if (agentcount[agentchatarray[i]] === undefined){
              agentcount[agentchatarray[i]] = 1;
            }else {
              agentcount[agentchatarray[i]] = agentcount[agentchatarray[i]] + 1;
            }
          }
        }
        this.agentNormalNotification.map((item, index) => {
          if (item.email === agentchatarray[i] && item.type === 'agent') {
            this.agentNormalNotification.splice(index, 1);
          }
        });
        this.agentNormalNotification.push({email: agentchatarray[i], count: agentcount[agentchatarray[i]], type: 'agent',
        user_name: agentchatarray[i].split('@')[0]});
      }
    }
  }
  cancelRequest(): any {
    this.spinner.hide();
  }
  userStatus(): any {
    const body = {};
    this.api.userStatus(body).subscribe(
      (res) => {
        this.onSuccessStatus(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessStatus(data): any {
    this.showuserstatus = true;
    this.flag = data.data.chat_flag;
  }
  updateUserStatus(flag): any {
    this.spinner.show();
    const data =  this.gs.getUserToken();
    const userName = data[0].user_name;
    const body = {support_user: userName, chat_flag: flag};
    this.api.updateUserStatus(body).subscribe(
      (res) => {
        this.onSuccesssUpdatesupport(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );

  }
  onSuccesssUpdatesupport(data): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'success',
      text: 'status updated successfully'
    }
    );
    this.userStatus();
  }
  history(): any {
    this.pageservice.setShowView('historyView');
  }
  gotoView(val): any {
    this.pageservice.setShowView(val);
  }
  onErrorr(error): any {
    this.spinner.hide();
  }
  export(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(this.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, this.fileName);
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
  onSuccessslogout(data): any {
    if (data.res_status === true) {
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('roles');
      sessionStorage.removeItem('chatData');
      this.router.navigateByUrl('auth/login');
      sessionStorage.removeItem('appVizUrl');
      this.router.navigateByUrl('auth/login', { skipLocationChange: true }).then(() => {
        this.router.navigate(['auth/login']);
      });
      window.location.reload();

    } else {
      sessionStorage.removeItem('appVizUrl');
      Swal.fire({
        icon: 'error',
        text: data.msg
      });
    }
  }
  changeTheme(primary): any {
    this.clrcode = primary;
    document.documentElement.style.setProperty('--primary-color', primary);
  }
  public handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }

  public handleClick(event: MouseEvent): void {
    if (this.dragging) {
      this.dragging = false;
      return;
    }
    alert('clicked!');
  }
  chatwindow(data): any {
    this.pageservice.setWindow(data);
    this.router.navigateByUrl('/pages/home');

  }
  cancel(): any {
    this.spinner.hide();
    this.common.http.cancelCall();
  }
  openclose(val): any {
    if (val === 'open') {
      this.open = false;
      this.close = true;
    }
    else if (val === 'close') {
      this.open = true;
      this.close = false;
    }
  }
  switchonChange(enable: boolean, evt): any {
    this.pageservice.switchData(enable);
  }
  dashboard(val, event): any {

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
  collapse(val): any {
    if (val === 'collapse') {
      this.col3 = '';
      this.col9 = 'col-sm-12 col-md-12 col-lg-12 p-0 pl-3 pr-3';
      this.hidetoggle = true;
      this.showtoggle = false;
      document.getElementById('dashwidth').style.width = '100%';
    } else if (val === 'expand') {
      this.col3 = 'col-sm-4 col-md-4 col-lg-3 p-0 pl-3';
      this.col9 = 'col-sm-8 col-md-8 col-lg-9';
      this.hidetoggle = false;
      this.showtoggle = true;
      document.getElementById('dashwidth').style.width = '75%';
    }
  }
  elasticSearch(): any {
    this.spinner.show();
    const body = { search_string: 'vendorportal/' + this.elastickeyword };
    this.api.elasticSearch(body).subscribe(
      (res) => {
        this.onSuccesselasticSearch(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesselasticSearch(data): any {
    this.docsdata = data;
    const obj = {data: this.docsdata, keyword: this.elastickeyword};
    this.elasticData = obj;
    this.pageservice.setShowView('elasticDoc');
    this.pageservice.setDocsData(obj);
    this.spinner.hide();
  }
 
  openChat(val, i): any {
    if (val.type === 'agent') {
      this.agentchatenabled = true;
   } else {
    this.agentchatenabled = false;
   }
    const obj = {username: val.email, user: val.user_name, typeofUser: val.type};

    this.agentNormalNotification.splice(i, 1);
    for (let j = 0; j < this.notarray.length; j++) {
      if (this.notarray[j].sender_name === obj.username && this.notarray[j].peer_chat_type === obj.typeofUser){
        this.notarray.splice(j, 1);
      }
    }

    this.pageservice.setOpenChat(obj);

  }

}