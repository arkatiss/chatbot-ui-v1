import { PagesService } from './../pages.service';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  HostListener,
  ElementRef,
  SecurityContext,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToBottomDirective } from '../scroll-to-bottom.directive';
import * as XLSX from 'xlsx';
import { DatePipe, DOCUMENT } from '@angular/common';
import { GeneralService } from '../../helper/general.service';
import { VoicerecognitionService } from '../../service/voicerecognition.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import Speech from 'speak-tts';
import { interval as observableInterval } from 'rxjs';
import { takeWhile, scan, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ChatService } from './chatservice/chat.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from '../../helper/common.service';
import { MessagingService } from '../../service/messaging.service';
import { UrlConfigService } from '../../helper/url-config.service';
import { ErrorService } from '../../helper/error.service';
import { ChangeDetectorRef } from '@angular/core';
type AOA = any[][];
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnChanges {
  // @ViewChild('spinhide') spinhide!: ElementRef;
  today = new Date();
  todaysDataTime = '';
  CurrentTime: any;
  timestamp: any;
  enterbox = true;
  showarrow = false;
  activeUsers: any[] = [];
  showperson = false;
  showperson2 = true;
  chatname: any;
  userName: any;
  timer = null;
  imgurl: any;
  chatnamedisplay: any;
  hidedashboard = true;
  showdashboard = false;
  @ViewChild(ScrollToBottomDirective) scroll: ScrollToBottomDirective | any;
  @ViewChild('sidenav') sidenav: MatSidenav | any;
  dataSource: MatTableDataSource<any> | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  @HostListener('window:scroll', ['$event'])
  @ViewChild('scrollMe')
  private myScrollContainer: ElementRef | any;
  mainuser: any;
  heading: any;
  notcurrent: any;
  currentshow: any;
  inputmsg: any;
  userId: any;
  msgdata: any;
  outputtype: any;
  keys: any;
  values: any;
  datamarkviewdata: any;
  valuess: any[] = [];
  chatResponse: any[] = [];
  peerResponse: any[] = [];
  outputreport: any[] = [];
  outputreportt: any[] = [];
  historydiv = false;
  showfile = false;
  data: AOA = [
    [1, 2],
    [3, 4],
  ];
  wopts: XLSX.WritingOptions = { bookType: 'xlsx', type: 'array' };
  fileName = 'userchat.xlsx';
  queryVal: string | any;
  chatbgcolor = false;
  datamarkdata: any[] = [];
  suggetions: any[] = [];
  datetime: any;
  starthide = true;
  stophide = false;
  bgColor: any;

  datevalue: any;
  sessionId: any;
  msg: any;
  datamarksdatewise: any[] = [];
  public dragging: boolean | any;
  showspinner = false;
  clrcode: any;
  open = true;
  close = false;
  abc: any;
  playValBoolean = false;
  playVal: any;
  pauseVal: any;
  playVal2: any[] = [];
  cnt = 1;
  botMsg: any;
  personMsg = 'start your conversation';
  enterword: any;
  lastMsg = false;
  attendanceheaders: string[] = [];
  undoMsg = false;
  appsshow = 'show';
  iconUrl: any;
  support: any;
  supportUser: any;
  peerChatType: any;
  enablevoicechat = false;
  enablecontrol = true;
  rcnumber: any;
  rcmsg: any;
  checked = false;
  color = '#727577';
  typeOfUser = '';
  agentChatMsg: any;
  agentName: any;
  checkedtoggle = false;
  chatbotmode = 'normal';
  supportType: any;
  showchat = true;
  showdatamarks = false;
  showmyview = false;
  showsuggestions = true;
  showrecommendations = false;
  showforecasting = false;
  showcollabarative = false;
  showagentchat = false;
  tabclass = 'chat';
  subtabclass = 'suggestions';
  subsubtabclass = 'forecasting';
  userNameLtr: any;
  loginuserName: any;
  agentShortName: any;
  enableagentchat = false;
  totalJson: any;
  starttime: any;
  endtime: any;
  urlsubstring: any;
  tilesdata: any;
  isTyping = false;
  prevLength = 0;
  agentchatenable = false;
  showattendance = false;
  rowData: any[] = [];
  displayedColumns: any[] = [];
  supervisor: any[] = [];
  Selector: any[] = [];
  lifOperator: any[] = [];
  transferAgentName: any;
  transferAgentEmail: any;
  supportPerson1: any;
  userRole: any;
  previousBotConversation: any;
  showhistory = false;
  subHistabclass: any;
  showlivechat = false;
  supportPersonBool = false;
  showuserIcon = true;
  showbotIcon = false;
  imgHeight: any;
  agentResponse: any[] = [];
  showPeerAgentChat = false;
  appType = 'chatbot';
  chatcardHeight = 'default';
  @Input() moveSelectedTab: any;
  @Input() acceptedagentData: any;
  @Output() getAcceptedData = new EventEmitter();
  loginFullName: any;
  acceptedData: any;
  locationCoordinates: any[] = [];
  filterData: any[] = [];
  currentLatitude: number | any = undefined;
  currentLongitude: number | any = undefined;
  WareHouseLocations: any;
  warehouseKey: any;
  entity: any;
  locationFlag: any;
  constructor(
    private router: Router,
    private pageservice: PagesService,
    @Inject(DOCUMENT) private document: Document,
    private general: GeneralService,
    public service: VoicerecognitionService,
    private spinner: NgxSpinnerService,
    private common: CommonService,
    private dialog: MatDialog,
    private msgservice: MessagingService,
    public url: UrlConfigService,
    public snack: MatSnackBar,
    public cs: ChatService,
    private sanitizer: DomSanitizer,
    private error: ErrorService,
    private cdr: ChangeDetectorRef
  ) {
    this.urlsubstring = this.url.getUrls();
    this.iconUrl = environment.iconUrl;
    const data = this.general.getUserToken();
    // this.userRole = this.general.getUserRoleData();

    this.general.getUserRoleData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          this.userRole = info;
        } else {
        }
      }
    });
    this.loginuserName = data[0].user_name;
    if (data[0].name === '' || data[0].name === undefined) {
      this.loginFullName = data[0].user_name.split('@')[0];
    } else {
      this.loginFullName = data[0].name;
    }
    this.agentShortName = data[0].user_name;
    this.userName = data[0].user_name;
    this.pageservice.getOpenChat().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info.typeofUser === 'agent') {
          this.pageservice.setAgentStatus(true);
          this.enableagentchat = true;
          this.showlivechat = true;
          this.appsshow = 'hide';
          this.peerChatType = 'agent';
          this.chatname = info.username;
          this.showPeerAgentChat = true;
          this.chatnamedisplay = info.user;
          this.retrieveAgentChat();
          this.showperson2 = true;
          this.showperson = false;
          this.chatcardHeight = 'agent';
        } else if (info.typeofUser === 'normal') {
          this.pageservice.setStatusUser(info.username);
          this.showperson = true;
          this.appsshow = 'hide';
          this.showuserIcon = false;
          this.showbotIcon = true;
          this.chatcardHeight = 'normal';
          this.peerChatType = 'normal';
          this.showperson2 = false;
          this.chatname = info.username;
          this.showPeerAgentChat = true;
          this.chatnamedisplay = info.user;
          this.userNameLtr = info.user[0];
          this.retrievePersonChat();
          this.checkedtoggle = false;
        } else {
          this.pageservice.setStatusUser(info.username);
          this.showperson = true;
          this.appsshow = 'hide';
          this.showuserIcon = false;
          this.showbotIcon = true;
          this.chatcardHeight = 'normal';
          this.peerChatType = 'normal';
          this.showperson2 = false;
          this.chatname = info.username;
          this.showPeerAgentChat = true;
          this.chatnamedisplay = info.user;
          this.userNameLtr = info.user[0];
          this.retrievePersonChat();
          this.checkedtoggle = false;
        }
      }
       this.cdr.detectChanges();
    });
    this.msgservice.recievedCloudMessage().subscribe((info: any) => {
      if (info !== undefined && info !== null) {

        if (info.data.peer_chat_type === 'normal') {

          if (info.data.is_updated === 'true') {
            this.peerResponse.map((item) => {
              item.peer_flag = +info.data.peer_flag;
            });
          } else if (
            info.data.is_typing !== null &&
            info.data.is_typing !== undefined
          ) {
            if (info.data.is_typing === 'true') {
              this.isTyping = true;
            } else {
              this.isTyping = false;
            }
          } else {
            this.peerResponse.push(info.data);
            this.peerResponse = [...this.peerResponse]
            this.isTyping = false;
            this.peerChatType = 'normal';
            this.updateRetPersonChat();
          }
        } else if (info.data.peer_chat_type === 'agent') {
          this.typeOfUser = info.data.peer_chat_type;
          this.pageservice.setAgentStatus(true);
          if (
            info.data.is_notify_agent === 'true' ||
            info.data.is_notify_agent === true
          ) {
            this.supportPerson1 = info.data.sender_name;
            // if (info.data.body === 'accept') {
            //   //  alert('Accepted');
            // }
            // else if (info.data.body === 'reject') {
            //   //alert('Rejected');
            // }
            // else {
            //   // alert ('you got a request');
            //   Swal.fire({
            //     title: 'Request',
            //     text: 'You got a request for live agent transfer from  ' + this.supportPerson1.split('@')[0],
            //     icon: 'info',
            //     showCancelButton: true,
            //     confirmButtonText: 'Accept',
            //     cancelButtonText: 'Reject'
            //   }).then((result) => {
            //     if (result.value) {
            //       this.requestStatus('accept');
            //     }
            //     else if (result.dismiss === Swal.DismissReason.cancel) {
            //       this.requestStatus('reject');
            //       Swal.fire(
            //         'Cancelled',
            //         'You rejected the request',
            //         'error'
            //       )
            //     }
            //   });
            //   // this.pageservice.setAgentStatus(false);
            // }
          } else if (
            (info.data.is_transfer === 'true' && info.data.body === 'accept') ||
            (info.data.is_transfer === 'true' && info.data.body === 'reject')
          ) {
            if (info.data.body === 'accept') {
              this.agentChatMsg = info.data.name;
              this.appsshow = 'hide';
              this.peerChatType = info.data.peer_chat_type;
              this.chatname = info.data.sender_name;
              this.chatnamedisplay = this.agentChatMsg;
              this.showPeerAgentChat = true;
              this.enableagentchat = true;
              this.chatResponse = [];
              this.botMsg = [];
              this.pageservice.setAgentStatus(false);
            } else {
              const obj = {
                outputData: [
                  'Our support agents are busy please connect after some time',
                ],
              };
              this.chatResponse.push(obj);
            }
          }
          // else if (info.data.is_transfer !== undefined && info.data.is_transfer !== null) {
          //   if (info.data.is_transfer === 'true') {
          //     this.transferAgentToUser(info.data.sender_name);
          //     this.agentChatMsg = info.data.sender_name.split('@')[0];

          //   }
          // }
          else if (
            info.data.is_typing !== null &&
            info.data.is_typing !== undefined
          ) {

            if (info.data.is_typing === 'true') {
              this.isTyping = true;
            } else {
              this.isTyping = false;
            }
          } else if (info.data.is_updated === 'true') {
          } else if (
            info.data.is_user_bot_chat_transfer !== undefined &&
            info.data.is_user_bot_chat_transfer !== null
          ) {
            this.pageservice.setAgentStatus(false);
            if (info.data.is_user_bot_chat_transfer === 'true') {
              this.previousBotConversation = JSON.parse(info.data.body);
            }
          } else {
            if (this.enableagentchat === true) {
              this.pageservice.setAgentStatus(false);
              this.agentResponse.push(info.data);
              this.peerChatType = 'agent';
              this.updateRetPersonChat();
            }
          }
        }
      }
      this.cdr.detectChanges();
    });
    this.pageservice.getVoiceChat().subscribe((info: any) => {
      // if(info !== undefined && info !== '' && info !== null && Object.keys(info).length > 0) {
      //   this.inputmsg = info;
      //   this.Chatclick();
      // }else {
      // }
    });
    this.pageservice.getTabData().subscribe((info: any) => {
      let data;
      if (info === 'Datamarks') {
        data = 'datamarks';
        this.showSelectedTab(data);
      } else if (info === 'My View') {
        data = 'suggestions';
        this.showSelectedTab('myview');
        this.showsuggestionsdatamarks(data);
      } else if (info === 'Recommendations') {
        data = 'recommendations';
        this.showSelectedTab('myview');
        this.showsuggestionsdatamarks(data);
      } else if (info === 'agent') {
        this.showSelectedTab('agent');
      }
       this.cdr.detectChanges();
    });

    this.pageservice.getSwitchData().subscribe((info: any) => {
      if (info === true) {
        if (this.cnt === 1) {
          this.inputmsg = 'Help Me';
          this.Chatclick();
        }
        this.enterbox = false;
        this.checkedtoggle = true;
        // this.Chatclick();
        this.cnt = 2;
      } else {
        this.enterbox = true;
        this.checkedtoggle = false;
      }
    });
    const sessionState = this.general.getSessionState();
    if (sessionState !== null) {
      this.chatResponse = sessionState;
      if (this.chatResponse.length > 0) {
        if (this.chatResponse.length === 1) {
          this.chatResponse.splice(-1);
        } else {
          this.chatResponse.splice(-1);
          this.chatResponse.splice(-1);
        }
      }
    }
    const time = new Date();
    //const inputtime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    const imgUrl = this.general.getPropertiesUrl();
    this.imgurl = imgUrl.imgPath;
    if (this.imgurl.includes('cs') === true) {
      this.botMsg = [
        'Hi, I am C&S Virtual Assistant. Let me know how I can help and I’ll do my best to assist you!',
        'I would recommend you to start with "sales for today" or "service level for today"',
      ];
      const usDate = new Date();
      this.timestamp = usDate.toLocaleString('en-US', {
        timeZone: 'America/New_York',
      });
      this.imgHeight = '50px';
    } else {
      this.botMsg = [
        'Hi, I am Intellobot. Let me know how I can help and I’ll do my best to assist you!',
      ];
      this.timestamp = time;
      this.imgHeight = '25px';
    }
    const speech = new Speech();
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
      speech
        .speak({
          text: '',
          queue: false, // current speech will be interrupted,
          listeners: {
            onstart: () => {},
            onend: () => {},
            onresume: () => {},
            onboundary: (event: any) => {},
          },
        })
        .then(() => {})
        .catch((e: any) => {});
    };
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.moveSelectedTab !== undefined && this.moveSelectedTab !== null) {
      this.showSelectedTab(this.moveSelectedTab);
    }
    if (
      this.acceptedagentData !== undefined &&
      this.acceptedagentData !== null
    ) {
      this.acceptedData = this.acceptedagentData;
    }
  }
  ngOnInit(): void {
    this.getCurrentLocation();
    this.service.init();
    this.changeTheme('#7ea3e0');

    this.WareHouseLocations = this.cs.getWareHouseLocations();
    this.pageservice.getChatData().subscribe((info: any) => {
      if (info.length > 0) {
        this.chatResponse = info;
      }
    });
  }
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    const body = {};
    if (
      tabChangeEvent.index === 1 &&
      tabChangeEvent.tab.textLabel === 'Datamarks'
    ) {
      this.cs.datamarks(body).subscribe(
        (res) => {
          this.onSuccesdatamark(res);
        },
        (err) => {
          this.onErrorr(err);
        }
      );
    } else if (
      tabChangeEvent.index === 2 &&
      tabChangeEvent.tab.textLabel === 'My View'
    ) {
      this.suggetions = [];
      this.cs.suggestions(body).subscribe(
        (res) => {
          this.onSuccessuggestion(res);
        },
        (err) => {
          this.onErrorr(err);
        }
      );
    }
  };
  onSuccesdatamark(data: any): any {
    this.spinner.hide();
    this.datamarkdata = data.data;
    this.msg = data.msg;
  }
  onSuccessuggestion(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      if (data.Suggestion) {
        this.suggetions = data.Suggestion;
      } else {
        this.msg = data.data;
      }
    } else {
      Swal.fire({
        text: data.msg,
      });
    }
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    this.error.handleError(error);
    this.dialog.closeAll();
  }
  changeTheme(primary: any): any {
    this.clrcode = primary;
    document.documentElement.style.setProperty('--primary-color', primary);
  }

  app_data_get(val: any): any {
    if (this.lastMsg === true) {
      if (val === 'yes') {
        this.inputmsg = 'chat_@reset';
        this.agentChatMsg = '';
        this.agentchatenable = false;
        this.lastMsg = true;
        this.Chatclick();
        this.pageservice.setShowView('showMainComponent');
      } else {
        this.chatResponse.push({
          inputData: 'no',
          outputData: ['Please Continue The Chat'],
        });
        setTimeout(() => {
          this.scrollToElement('');
        }, 1000);
        this.lastMsg = false;
        this.inputmsg = val;
        this.pageservice.setShowView('showMainComponent');
      }
    } else {
      this.inputmsg = val;
      this.Chatclick();
    }
  }

  scrollTop(el: any): any {
    const duration = 600;
    const interval = 5;
    const move = (el.scrollTop * interval) / duration;
    observableInterval(interval)
      .pipe(
        scan((acc, curr) => acc - move, el.scrollTop),
        tap((position) => (el.scrollTop = position)),
        takeWhile((val) => val > 0)
      )
      .subscribe();
  }
  startService(): any {
    this.inputmsg = '';
    this.service.text = '';
    this.service.start();

    setTimeout(() => {
      this.inputmsg = this.service.text;
      this.Chatclick();
    }, 3000);
    this.starthide = false;
    this.stophide = true;
    (document.getElementById('myInput') as HTMLInputElement).readOnly = true;
  }
  stopService(): any {
    this.service.stop();
    this.starthide = true;
    this.stophide = false;
    (document.getElementById('myInput') as HTMLInputElement).readOnly = false;
  }

  getActiveUsers(): any {
    const body = {};
    this.cs.getActiveUsers(body).subscribe(
      (res) => {
        this.onSuccessActiveUsers(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessActiveUsers(data: any): any {
    if (data.res_status === true) {
      const users = data.data;
      this.activeUsers = [];
      for (const a of users) {
        const user = a.user_name.split('@');
        const userName = user[0];
        this.activeUsers.push({
          user: userName,
          username: a.user_name,
          chatFlag: a.chat_flag,
        });
      }
    } else {
      Swal.fire({
        text: data.msg,
      });
    }
    this.cdr.detectChanges();
  }
  chatUser(val: any): any {
    this.pageservice.setStatusUser(val.username);
    this.userNameLtr = val.user[0];
    if (val.typeofUser === 'agent') {
      this.appsshow = 'hide';
      this.peerChatType = 'agent';
      this.chatname = val.username;
      this.chatnamedisplay = val.user;
      this.showPeerAgentChat = true;
      this.retrieveAgentChat();
      this.showperson2 = true;
      this.showperson = false;
      this.chatcardHeight = 'agent';
    } else if (val.typeofUser === 'normal') {
      this.showperson = true;
      this.showperson2 = false;
      this.appsshow = 'hide';
      this.showuserIcon = false;
      this.showbotIcon = true;
      this.peerChatType = 'normal';
      this.chatname = val.username;
      this.chatnamedisplay = val.user;
      this.showPeerAgentChat = true;
      this.chatcardHeight = 'normal';
      this.retrievePersonChat();
      this.checkedtoggle = false;
    } else {
      this.showperson = true;
      this.appsshow = 'hide';
      this.showuserIcon = false;
      this.showbotIcon = true;
      this.peerChatType = 'normal';
      this.chatcardHeight = 'normal';
      this.showperson2 = false;
      this.chatname = val.username;
      this.chatnamedisplay = val.user;
      this.showPeerAgentChat = true;
      this.retrievePersonChat();
      this.checkedtoggle = false;
    }
  }
  showBotChat(): any {
    this.pageservice.setStatusUser('');
    this.showperson2 = true;
    this.showperson = false;
    this.appsshow = 'show';
    this.chatcardHeight = 'default';
    this.chatname = '';
    this.showPeerAgentChat = false;
    this.peerResponse = [];
    this.showuserIcon = true;
    this.showbotIcon = false;
  }
  updateSupportGroup(): any {
    const body = { support_user: this.support, chat_flag: 0 };
    this.cs.updateSupportGroup(body).subscribe(
      (res) => {
        this.onSuccesssUpdatesupport(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssUpdatesupport(data: any): any {
    // console.log(data);
  }
  sendChat(val: any): void {
    this.inputmsg = val;
    this.Chatclick();
  }
  closeuserChat(val: any): void {
    Swal.fire({
      title: 'Close',
      text: 'Do you want to close chat',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.value) {
        const rating = [
          { support_user: this.support, rating: '1' },
          { support_user: this.support, rating: '2' },
          { support_user: this.support, rating: '3' },
          { support_user: this.support, rating: '4' },
          { support_user: this.support, rating: '5' },
        ];
        this.supportUser = this.support;
        this.support = '';
        this.enableagentchat = false;
        const obj = {
          outputData: [
            "We'll be happy to assist you with anything else. Have a great day ahead!",
            'How would you rate your support experience?',
          ],
          ratings: rating,
          sender_name: this.agentChatMsg,
        };
        this.agentResponse.push(obj);
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        //this.requestStatus('reject');
        Swal.fire('Cancelled', 'you can continue chat', 'error');
      }
    });
  }
  Chatclick(): void {
    const time = new Date();
    // const inputtime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
    let inputtime;
    if (this.imgurl.includes('cs') === true) {
      const usDate = new Date();
      inputtime = usDate.toLocaleString('en-US', {
        timeZone: 'America/New_York',
      });
    } else {
      inputtime = time;
    }
    this.showattendance = false;
    if (this.showPeerAgentChat === false) {
      if (this.inputmsg.trim() === '' || this.inputmsg === ' undefined') {
        alert('Enter or Say Something');
      } else {
        if (this.lastMsg === true) {
          this.chatResponse = [];
        } else if (this.undoMsg === true) {
          this.chatResponse.push({
            inputData: '',
            inptimestamp: '',
          });
        } else {
          this.chatResponse.push({
            inputData: this.inputmsg,
            inptimestamp: inputtime,
          });
        }
        this.showspinner = true;
        // this.document.getElementById('spinhide').style.display = 'none';
        // this.spinhide.nativeElement.style.display = 'none';
        this.spinner.show();
        this.msgdata = [];
        this.keys = [];
        this.valuess = [];
        this.outputreport = [];
        const arr = [1];
        const newItems = this.chatResponse;
        arr.push(...newItems);
        let body = {};
        if (
          this.enterword !== undefined &&
          this.enterword !== '' &&
          this.enterword !== null
        ) {
          body = {
            input: this.enterword + '@@@' + this.inputmsg,
            chat_bot_mode: this.chatbotmode,
            context: {
              'user-agent': {
                browser: this.getBrowserName(),
                browser_version: this.getBrowserVersion(),
              },
              'user-interface': 'web-ui',
              app_type: this.appType,
            },
          };
        } else if (this.lastMsg === true) {
          body = {
            input: this.inputmsg,
            chat_bot_mode: this.chatbotmode,
            context: {
              'user-agent': {
                browser: this.getBrowserName(),
                browser_version: this.getBrowserVersion(),
              },
              'user-interface': 'web-ui',
              app_type: this.appType,
            },
          };
        } else if (this.undoMsg === true) {
          body = {
            input: this.inputmsg,
            chat_bot_mode: this.chatbotmode,
            context: {
              'user-agent': {
                browser: this.getBrowserName(),
                browser_version: this.getBrowserVersion(),
              },
              'user-interface': 'web-ui',
              app_type: this.appType,
            },
          };
        } else if (
          this.supportType !== undefined &&
          this.supportType !== '' &&
          this.supportType !== null
        ) {
          body = {
            input: 'support' + '####' + this.inputmsg,
            chat_bot_mode: this.chatbotmode,
            context: {
              'user-agent': {
                browser: this.getBrowserName(),
                browser_version: this.getBrowserVersion(),
              },
              'user-interface': 'web-ui',
              app_type: this.appType,
            },
          };
        } else {
          body = {
            input: this.inputmsg,
            chat_bot_mode: this.chatbotmode,
            context: {
              'user-agent': {
                browser: this.getBrowserName(),
                browser_version: this.getBrowserVersion(),
              },
              'user-interface': 'web-ui',
              app_type: this.appType,
            },
          };
        }
        this.enterword = '';
        this.undoMsg = false;
        this.supportType = '';
        this.starttime = new Date();
        this.cs.sendMessage(body).subscribe(
          (res: any) => {
            this.onSuccesss(body, res);
          },
          (err) => {
            this.onErrorr(err);
          }
        );
      }
    } else {
      const endChatArray = ['bye', 'see you', 'good bye'];
      const array = [];
      for (let i = 0; i < endChatArray.length; i++) {
        if (this.inputmsg.toLowerCase() === endChatArray[i]) {
          array.push(this.inputmsg);
        }
      }
      if (array.length > 0 && this.typeOfUser === 'agent') {
        this.showlivechat = false;
        this.agentchatenable = false;
        const rating = [
          { support_user: this.support, rating: '1' },
          { support_user: this.support, rating: '2' },
          { support_user: this.support, rating: '3' },
          { support_user: this.support, rating: '4' },
          { support_user: this.support, rating: '5' },
        ];
        const obj = {
          inputData: this.inputmsg,
          sender_name: this.loginuserName,
        };
        this.showPeerAgentChat = false;
        this.typingChat(this.inputmsg);
        const obj2 = {
          outputData: [
            "We'll be happy to assist you with anything else. Have a great day ahead!",
            'How would you rate your support experience?',
          ],
          ratings: rating,
          sender_name: this.agentChatMsg,
        };
        if (this.supportPersonBool === true) {
          const body = {
            peer_type: 'insert',
            sender_name: this.loginuserName,
            receiver_name: this.support,
            input: this.inputmsg,
            peer_chat_type: this.peerChatType,
          };
          this.cs.sendMessage(body).subscribe(
            (res) => {
              this.onSuccessUsersChat(res);
            },
            (err) => {
              this.onErrorr(err);
            }
          );
          this.agentResponse.push(obj);
          this.agentResponse.push(obj2);
        } else {
          this.agentResponse = [];
          this.chatResponse = [];
          if (this.general.getSessionState() !== null) {
            this.chatResponse = this.general.getSessionState();
          }
          this.agentChatMsg = '';
          if (this.chatResponse !== undefined && this.chatResponse !== null) {
            this.chatResponse.splice(-1);
          }
          this.supportPersonBool = false;
        }
        setTimeout(() => {
          this.scrollToElement('');
        }, 1000);
        this.supportUser = this.support;
        this.support = '';
        this.chatname = '';
        this.showPeerAgentChat = false;
        this.showperson2 = true;
        this.enableagentchat = false;
        this.chatcardHeight = 'default';
      } else {
        if (this.peerChatType === 'normal') {
          // const inputtime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
          this.peerResponse.push({
            body: this.inputmsg,
            peer_time: time,
            sender_name: this.loginuserName,
            peer_flag: 0,
          });
        } else if (this.peerChatType === 'agent') {
          this.agentResponse.push({
            inputData: this.inputmsg,
            inptimestamp: inputtime,
            sender_name: this.loginuserName,
          });
        }
        const body = {
          peer_type: 'insert',
          sender_name: this.loginuserName,
          receiver_name: this.chatname,
          input: this.inputmsg,
          peer_chat_type: this.peerChatType,
        };
        this.cs.sendMessage(body).subscribe(
          (res) => {
            this.onSuccessUsersChat(res);
          },
          (err) => {
            this.onErrorr(err);
          }
        );
        this.inputmsg = '';
      }
    }
  }
  onSuccessUsersChat(data: any): any {
    if (data.res_status === true) {
    }
  }
  retrievePersonChat(): any {
    const body = {
      peer_type: 'retrieve',
      sender_name: this.loginuserName,
      receiver_name: this.chatname,
      peer_chat_type: 'normal',
      input:''
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessUsersRetChat(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  retrieveAgentChat(): any {
    const body = {
      peer_type: 'retrieve',
      sender_name: this.loginuserName,
      receiver_name: this.chatname,
      peer_chat_type: 'agent',
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessUsersRetChat2(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUsersRetChat2(data: any): any {
    if (data.res_status === true) {
      this.chatResponse = [];
      this.agentResponse = data.data;
      if (this.agentName !== undefined) {
        this.agentChatMsg = this.agentName;
      } else {
        if (data.data[0].sender_name === this.loginuserName) {
          this.agentChatMsg = data.data[0].receiver_name.split('@')[0];
        } else {
          this.agentChatMsg = data.data[0].sender_name.split('@')[0];
        }
      }
      this.typeOfUser = data.data[0].peer_chat_type;
      this.agentchatenable = true;
      this.updateRetPersonChat();
    } else {
      this.agentResponse = [];
      this.chatResponse = [];
    }
  }
  onSuccessUsersRetChat(data: any): any {
    if (data.res_status === true) {
      this.peerResponse = data.data;
      this.typeOfUser = data.data[0].peer_chat_type;

      this.updateRetPersonChat();
    } else {
      this.peerResponse = [];
    }
    this.cdr.detectChanges();
  }
  updateRetPersonChat(): any {
    const body = {
      peer_type: 'update',
      sender_name: this.loginuserName,
      receiver_name: this.chatname,
      peer_chat_type: this.peerChatType,
      input:''
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessUserUpdate(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUserUpdate(data: any): any {}
  onSuccesss(body: any, data: any): any {
    if (data.res_status === true) {
      this.inputmsg = '';
      this.showspinner = false;
      this.spinner.hide();
      this.chatbgcolor = true;
      this.showfile = true;
      this.service.text = '';
      if (data.support) {
        this.msgdata = data.data;
        this.support = data.support;
        if (this.support.length > 0) {
          this.supportPersonBool = true;
          this.agentName = this.msgdata.support_person;
          const layout = [
            { key: 'yes', value: data.support },
            { key: 'no', value: '' },
          ];
          const obj = {
            outputData: [
              'Our support person from ' +
                this.msgdata.domain +
                ' domain is ready to assist you',
              'Do you want to chat ?',
            ],
            suppportchat: layout,
          };
          this.chatResponse.push(obj);
        } else {
          const layout = [
            { key: 'yes', value: 'navigate' },
            { key: 'no', value: 'notnavigate' },
          ];
          this.chatResponse.push({
            outputData: [
              data.msg,
              'Do you want to schedule a callback from Customer Service Agent?',
            ],
            suppportchat: layout,
          });
        }
      } else {
        if (this.lastMsg === true) {
          this.chatResponse = [];
          this.lastMsg = false;
        } else {
          this.msgdata = data.data;
          if (this.msgdata.length === 0) {
            const object = { outputData: [data.data.msg] };
            this.chatResponse.push(object);
          } else {
            this.general.setData(data);
            const outputType = this.msgdata.output.type;
            const chatbotcbType = this.msgdata.output.cb_type;
            const list = this.msgdata.output.list;
            const outtime = this.msgdata.output.time;
            this.datevalue = outtime;
            const layoutvals = ['yes', 'no'];
            let OutputMsgData = this.msgdata.output.data;
            OutputMsgData = String(OutputMsgData);
            OutputMsgData = OutputMsgData.split('@#@#');
            const prompt = this.msgdata.output.prompt;
            const tiles: any[] = this.msgdata.output.tiles;
            let tiledataname;
            let tiledatacount;
            const dynamiCForms = this.msgdata?.output?.form_columns;
            if (tiles !== undefined && tiles.length > 0) {
              const tiledata = this.msgdata.output.data.split(':');
              tiledataname = tiledata[0];
              tiledatacount = tiledata[1];
              this.tilesdata = tiles;
              this.supervisor = [];
              this.Selector = [];
              this.lifOperator = [];
              for (let t = 0; t < this.tilesdata.length; t++) {
                if (this.tilesdata[t].role.toLowerCase() === 'supervisor') {
                  this.supervisor.push(this.tilesdata[t]);
                } else if (
                  this.tilesdata[t].role.toLowerCase() === 'selector'
                ) {
                  this.Selector.push(this.tilesdata[t]);
                } else {
                  this.lifOperator.push(this.tilesdata[t]);
                }
              }
            }
            if (outputType === 'cb_report') {
              this.chatResponse.push({
                outputData: OutputMsgData,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
                tilename: tiledataname,
                tilecount: tiledatacount,
              });
              let gridWindowData = [];
              gridWindowData = this.msgdata.output.main_window;
              const gridIntent = this.msgdata?.output?.intent;
              this.entity = '';
              this.entity = this.msgdata?.output?.entity;
              this.filterData = gridWindowData;

              const rowData =
                this.entity !== undefined &&
                this.entity !== null &&
                this.entity !== ''
                  ? this.getRowData()
                  : gridWindowData;
              const gridObj = {
                intent: gridIntent,
                rowData: rowData,
                gridData: gridWindowData,
                entity: this.msgdata?.output?.entity,
                locationCoordinates: this.locationCoordinates,
                locationFlag: this.locationFlag,
                warehouseKey: this.warehouseKey,
              };

              this.pageservice.storevalues(gridObj);
              this.pageservice.setShowView('showGridComponent');
            } else if (list) {
              this.chatResponse.push({
                outputData: OutputMsgData,
                layout: this.msgdata.output.list,
                outtimestamp: outtime,
                dateformat: outtime,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
                tilename: tiledataname,
                tilecount: tiledatacount,
              });
              // this.router.navigateByUrl('/pages/main');
              this.pageservice.setShowView('showMainComponent');
            } else if (
              chatbotcbType === 'data_entry' &&
              outputType === 'selected'
            ) {
              this.chatResponse.push({
                outputData: OutputMsgData,
                outtimestamp: outtime,
                dateformat: outtime,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
                tilename: tiledataname,
                tilecount: tiledatacount,
              });
              const objs = {
                form_type: this.msgdata.output.form_type,
                entry_forms: this.msgdata.output.entry_forms,
                filterString: this.msgdata.output.filter_string,
              };
              if (this.msgdata.output.form_type === 'form') {
                this.general.setFormData(objs);
                this.outputreportt = [];
                this.pageservice.storevalues(this.outputreportt);
                // this.router.navigateByUrl('/pages/main/chat');
                this.pageservice.setShowView('showFormComponent');
              } else if (this.msgdata.output.form_type === 'link') {
                this.general.setFormData(objs);
                // this.router.navigateByUrl('/pages/main/documentview');
                this.pageservice.setShowView('showDocsComponent');
              } else {
                this.pageservice.setShowView('showMainComponent');
              }
            } else if (outputType === 'selected') {
              this.chatResponse.push({
                outputData: OutputMsgData,
                layout: this.msgdata.output.templates,
                outtimestamp: outtime,
                dateformat: outtime,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
                tilename: tiledataname,
                tilecount: tiledatacount,
              });
            } else if (chatbotcbType === 'data_entry') {
              const substring = 'Enter';
              if (this.msgdata.output.entry_forms.length > 0) {
                if (this.msgdata.output.entry_forms[0].includes(substring)) {
                  this.enterword = this.msgdata.output.entry_forms[0];
                  this.chatResponse.push({
                    outputData: OutputMsgData,
                    outtimestamp: outtime,
                    dateformat: outtime,
                    yn: layoutvals,
                    uniqueeid: this.msgdata.output.unique_id,
                    promptVal: prompt,
                    tilename: tiledataname,
                    tilecount: tiledatacount,
                  });
                } else {
                  this.chatResponse.push({
                    outputData: OutputMsgData,
                    layout: this.msgdata.output.entry_forms,
                    outtimestamp: outtime,
                    dateformat: outtime,
                    yn: layoutvals,
                    uniqueeid: this.msgdata.output.unique_id,
                    promptVal: prompt,
                    tilename: tiledataname,
                    tilecount: tiledatacount,
                  });
                }
              } else {
                this.chatResponse.push({
                  outputData: OutputMsgData,
                  layout: this.msgdata.output.entry_forms,
                  outtimestamp: outtime,
                  dateformat: outtime,
                  yn: layoutvals,
                  uniqueeid: this.msgdata.output.unique_id,
                  promptVal: prompt,
                  tilename: tiledataname,
                  tilecount: tiledatacount,
                });
              }
              this.pageservice.setShowView('showMainComponent');
            } else {
              // const httparray = [];
              // const http = 'http';
              // for (let a = 0; a < OutputMsgData.length; a++) {
              //   if (OutputMsgData[a].includes(http)) {
              //     const str = OutputMsgData[a].replace(/ /g, '%20');;
              //     httparray.push('Please  ' + '<a href=' + str + ' target="_blank">' + 'click here' + '</a>');
              //   } else {
              //     httparray.push(OutputMsgData[a]);
              //   }
              // }
              // this.sanitizer.sanitize(SecurityContext.HTML, httparray[0]);

              if (dynamiCForms) {
                this.pageservice.setShowView('showDynamicForms');
                this.general.setDynamicFormsData({
                  forms: dynamiCForms,
                  formData: this.msgdata?.output?.form_data,
                  intent: this.msgdata?.output?.intent,
                  submiturl: this.msgdata?.output?.create_url,
                  getUrl: this.msgdata?.output?.url,
                });
              } else {
                this.pageservice.setShowView('showMainComponent');
              }

              this.chatResponse.push({
                outputData: OutputMsgData,
                outtimestamp: outtime,
                dateformat: outtime,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
                tilename: tiledataname,
                tilecount: tiledatacount,
              });
              setTimeout(() => {
                this.cdr.detectChanges();
              });
            }
            console.log(this.chatResponse);
            this.supportType = this.msgdata.output.support_type;
            this.pageservice.setChatData(this.chatResponse);
          }
          setTimeout(() => {
            this.scrollToElement('');
          }, 1000);
        }
      }
    } else {
      this.showspinner = false;
      this.spinner.hide();
      if (data.pre_link) {
        const obj = { outputData: [this.error.handleError(data)] };
        this.chatResponse.push(obj);
        this.router.navigateByUrl(data.pre_link);
      } else {
        const obj = { outputData: [this.error.handleError(data)] };
        this.chatResponse.push(obj);
      }
      this.pageservice.setChatData(this.chatResponse);
    }
    this.general.setSessionState(this.chatResponse);
    this.endtime = new Date();
    const seconds = this.calculateTime(this.starttime, this.endtime);
    const obj = {
      API_URL:
        this.general.getHttpUrl('serverHost') + this.urlsubstring?.chatListapi,
      Input: body,
      query: 'NA',
      Time: seconds + ' Sec',
    };
    this.totalJson = { Keyword: obj };
    Object.assign(
      this.totalJson?.Keyword,
      { intent: this.msgdata?.output?.intent },
      { entity: this.msgdata?.output?.entity },
      { url: this.msgdata?.output?.url },
      { payload: this.msgdata?.output?.payload },
      { dataviz_url: this.msgdata?.output?.dataviz_url }
    );
    this.pageservice.setDiagnosticsData(this.totalJson);
  }
  chatwindow(data: any): any {
    this.pageservice.setWindow(data);
    this.router.navigateByUrl('/pages/home');
  }

  calcTime(offset: any): any {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * offset);
    return nd.toLocaleString();
  }

  Datamarksdata(datamarkid: any): any {
    this.inputmsg = datamarkid;
    this.showSelectedTab('chat');
    this.Chatclick();
  }
  chatuser(val: any): any {
    this.inputmsg = val;
    this.showSelectedTab('chat');
    this.Chatclick();
  }

  moveToSelectedTab(tabName: string): any {
    for (
      let i = 0;
      i < document.querySelectorAll('.mat-tab-label-content').length;
      i++
    ) {
      if (
        (document.querySelectorAll('.mat-tab-label-content')[i] as HTMLElement)
          .innerText == tabName
      ) {
        (document.querySelectorAll('.mat-tab-label')[i] as HTMLElement).click();
      }
    }
  }
  resetChat(): any {
    const layouts = ['yes', 'no'];
    const obj = {
      outputData: ['Do you want to reset chat ?'],
      layout: layouts,
    };
    this.chatResponse.push(obj);
    setTimeout(() => {
      this.scrollToElement('');
    }, 1000);
    this.lastMsg = true;
  }
  undoChat(): any {
    this.undoMsg = true;
    this.inputmsg = 'chat_@undo';
    this.Chatclick();
  }
  scrollToElement(el: any): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
  cancelRequest(): any {
    this.common.http.cancelCall();
    this.spinner.hide();
  }
  peerChat(val: any): any {
    if (val.key === 'yes') {
      if (val.value === 'navigate') {
        const obj = { form_type: 'form', entry_forms: 'callbackform' };
        this.general.setFormData(obj);
        // this.router.navigateByUrl('/pages/main/chat');
        this.chatResponse.push({ inputData: 'yes' });
        setTimeout(() => {
          this.scrollToElement('');
        }, 1000);
        this.pageservice.setShowView('showFormComponent');
      } else if (val.value === 'notnavigate') {
      } else {
        if (this.support.length > 0) {
          const obj = {
            outputData: [
              'Wait for some time we are connecting to our live agent',
            ],
          };
          this.chatResponse.push(obj);
          this.requestToAgent();
        } else {
          // alert('your chat session has been ended ');
        }
      }
    } else {
      if (val.value === 'notnavigate') {
        //this.chatResponse.push({outputData: ['Please Continue The Chat']});
        this.chatResponse.push({
          inputData: 'no',
          outputData: ['Please Continue The Chat'],
        });
        setTimeout(() => {
          this.scrollToElement('');
        }, 1000);
        this.pageservice.setShowView('showMainComponent');
      } else {
        // alert('your chat session has been ended ');
        //this.chatResponse.push({outputData: ['Please Continue The Chat']});
        this.chatResponse.push({
          inputData: 'no',
          outputData: ['Please Continue The Chat'],
        });
        setTimeout(() => {
          this.scrollToElement('');
        }, 1000);
        this.updateSupportGroup();
        this.pageservice.setShowView('showMainComponent');
      }
    }
  }
  requestToAgent(): void {
    const body = {
      peer_type: 'transfer',
      sender_name: this.loginuserName,
      receiver_name: this.support,
      peer_chat_type: 'agent',
      input: 'request',
      user_data: JSON.stringify(this.chatResponse),
      name: this.loginFullName,
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onsuccessRequestAgent(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onsuccessRequestAgent(data: any): void {
    if (data.res_status === true) {
    }
  }
  ratingUserChat(val: any): any {
    if (
      this.supportUser !== '' &&
      this.supportUser !== undefined &&
      this.supportUser !== null
    ) {
      const body = { support_user: val.support_user, input: val.rating };
      this.cs.sendMessage(body).subscribe(
        (res) => {
          alert('Thank you for giving valuable feedback');
          this.chatResponse = [];
          this.agentResponse = [];
          this.agentChatMsg = '';
          this.enableagentchat = false;
          this.peerChatType = '';
          this.showPeerAgentChat = false;
          this.botMsg = [
            'Hi, I am C&S Virtual Assistant. Let me know how I can help and I’ll do my best to assist you!',
            'I would recommend you to start with "sales for today" or "service level for today"',
          ];
          this.chatResponse = this.general.getSessionState();
          if (this.chatResponse.length > 0) {
            if (this.chatResponse.length === 1) {
              this.chatResponse.splice(-1);
            } else {
              this.chatResponse.splice(-1);
              this.chatResponse.splice(-1);
            }
            this.supportPersonBool = false;
          }
        },
        (err) => {
          this.onErrorr(err);
        }
      );
      this.supportUser = '';
    } else {
      alert('your rating is already submitted');
    }
  }
  getPreviousConversation(): any {
    const body = {
      peer_type: 'user_bot_chat_transfer',
      sender_name: this.loginuserName,
      receiver_name: this.chatname,
      peer_chat_type: 'agent',
      input: JSON.stringify(this.chatResponse),
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessPreviousConversation(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }

  getSelectedAgentChat(data: any): void {
    this.getAcceptedData.emit(data);
  }
  onSuccessPreviousConversation(data: any): any {}
  switchonChange(enable: boolean, evt: any): any {
    this.pageservice.switchData(enable);
  }
  enableVoiceChat(chat: any): any {
    if (chat === 'enable') {
      this.enablevoicechat = true;
      this.enablecontrol = false;
      this.startService();
    } else {
      this.enablevoicechat = false;
      this.enablecontrol = true;
      this.stopService();
      (document.getElementById('myInput') as HTMLInputElement).readOnly = false;
    }
  }
  switchtoRC(openMessage: any): any {
    this.dialog.open(openMessage, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 60px)',
    });
  }
  keyPressNumbers(event: any): any {
    const pattern = /[0-9\+\-\ ]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  closedialog(): any {
    this.dialog.closeAll();
  }
  selectedDatamark(val: any): any {
    this.datamarksdatewise = [];
    this.spinner.show();
    const body = { datetime: val };
    this.cs.datamarks(body).subscribe(
      (res) => {
        this.onSuccesseldatamark(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesseldatamark(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.datamarksdatewise = data.data;
    } else {
      Swal.fire({
        text: data.msg,
      });
      this.error.handleError(data);
    }
  }
  switchMode(value: any): any {
    if (value === true) {
      this.chatbotmode = 'intelligent';
    } else {
      this.chatbotmode = 'normal';
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
  showSelectedTab(val: any): any {
    this.tabclass = val;
    const body = {};
    if (val === 'chat') {
      this.showhistory = false;
      this.showchat = true;
      this.showdatamarks = false;
      this.showmyview = false;
      this.showagentchat = false;
      this.showcollabarative = false;
    } else if (val === 'datamarks') {
      this.showchat = false;
      this.showdatamarks = true;
      this.showmyview = false;
      this.showcollabarative = false;
      this.showagentchat = false;
      this.showhistory = false;
      this.cs.datamarks(body).subscribe(
        (res) => {
          this.onSuccesdatamark(res);
        },
        (err) => {
          this.onErrorr(err);
        }
      );
    } else if (val === 'myview') {
      this.showmyview = true;
      this.showchat = false;
      this.showdatamarks = false;
      this.showcollabarative = false;
      this.suggetions = [];
      this.showagentchat = false;
      this.cs.suggestions(body).subscribe(
        (res) => {
          this.onSuccessuggestion(res);
        },
        (err) => {
          this.onErrorr(err);
        }
      );
    } else if (val === 'agent') {
      this.showagentchat = true;
      this.showchat = false;
      this.showdatamarks = false;
      this.showmyview = false;
      this.showcollabarative = false;
      this.showhistory = false;
    }
  }
  showHistoryTab(val: any): any {
    this.subHistabclass = val;
    if (val === 'livechat') {
      this.showhistory = false;
      this.showdatamarks = false;
      this.showmyview = false;
      this.showagentchat = false;
      this.showcollabarative = false;
      this.showperson2 = true;
    } else if (val === 'history') {
      this.showdatamarks = false;
      this.showmyview = false;
      this.showagentchat = false;
      this.showcollabarative = false;
      this.showhistory = true;
      this.showperson2 = false;
    }
  }
  showsuggestionsdatamarks(val: any): any {
    debugger;
    this.subtabclass = val;
    if (val === 'suggestions') {
      this.showsuggestions = true;
      this.showrecommendations = false;
      this.showforecasting = false;
      this.showcollabarative = false;
    } else if (val === 'recommendations') {
      this.showsuggestions = false;
      this.showrecommendations = true;
      this.showforecasting = true;
    }
  }
  forecasting(val: any): any {
    this.subsubtabclass = val;
    if (val === 'forecasting') {
      this.showforecasting = true;
      this.showcollabarative = false;
    } else if (val === 'collaborative') {
      this.showforecasting = false;
      this.showcollabarative = true;
    }
  }

  calculateTime(start: any, end: any): any {
    let timeDiff = end - start;
    timeDiff /= 1000;
    const seconds = Math.round(timeDiff);
    return seconds;
  }
  typingChat(typing: any): any {
    const curLength: number = typing.length;
    if (this.showPeerAgentChat === true) {
      if (curLength > this.prevLength && this.prevLength === 0) {
        const body = {

          peer_type: 'typing',
          typing: 'true',
          sender_name: this.loginuserName,
          receiver_name: this.chatname,
          peer_chat_type: this.peerChatType,
          input: '',
        };
        this.cs.sendMessage(body).subscribe(
          (res) => {
            this.onSuccessUsersChat(res);
          },
          (err) => {
            this.onErrorr(err);
          }
        );
      }
      if (curLength < this.prevLength && curLength === 0) {
        const body = {
          peer_type: 'typing',
          typing: 'false',
          sender_name: this.loginuserName,
          receiver_name: this.chatname,
          peer_chat_type: this.peerChatType,
          input: '',
        };
        this.cs.sendMessage(body).subscribe(
          (res) => {
            this.onSuccessUsersChat(res);
          },
          (err) => {
            this.onErrorr(err);
          }
        );
      }
      this.prevLength = curLength;
    } else {
      if (
        this.peerChatType !== undefined &&
        this.showPeerAgentChat === false &&
        this.peerChatType !== '' &&
        this.peerChatType !== null
      ) {
        const body = {
          peer_type: 'typing',
          typing: 'false',
          sender_name: this.loginuserName,
          receiver_name: this.chatname,
          peer_chat_type: this.peerChatType,
          input: '',
        };
        this.cs.sendMessage(body).subscribe(
          (res) => {
            this.onSuccessUsersChat(res);
          },
          (err) => {
            this.onErrorr(err);
          }
        );
      }
    }
    // if (this.peerChatType === 'normal' && this.showPeerAgentChat === true) {

    // }
  }

  transferChat(): any {
    const body = {};
    this.cs.transferChat(body).subscribe(
      (res) => {
        this.onSuccessTransferChat(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessTransferChat(data: any): any {
    if (data.res_status == true) {
      if (data.support.length > 0) {
        this.transferAgentName = '';
        this.transferAgentEmail = '';
        this.transferAgentName = data.data.support_person;
        this.transferAgentEmail = data.support;
      } else {
        this.snack.open(data.msg, 'Ok', { duration: 5000 });
        this.transferAgentName = '';
        this.transferAgentEmail = '';
      }
    }
  }

  getAttendanceData(val: any): any {
    this.tilesdata = val;
    this.showattendance = true;
    this.displayedColumns = ['sno', 'name', 'role', 'warehouse_name'];
    this.dataSource = new MatTableDataSource<any>(val);
    this.dataSource.paginator = this.paginator;
  }
  openAttendanceData(): any {
    this.pageservice.storevalues(this.tilesdata);
    // this.router.navigateByUrl('/pages/main/chat');
    this.pageservice.setShowView('showGridComponent');
  }
  updateAgentStatus(): any {
    const body = {
      sender_name: this.loginuserName,
      receiver_name: this.chatname,
    };
    this.cs.updateAgentStatus(body).subscribe(
      (res) => {
        this.onSuccesssUpdateAgentStatus(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssUpdateAgentStatus(data: any): any {}
  transferToAgent(): any {
    const body = {
      peer_type: 'notify_agent',
      sender_name: this.loginuserName,
      receiver_name: this.transferAgentEmail,
      input: 'live agent transfer',
      peer_chat_type: 'agent',
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessTransferToAgent(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessTransferToAgent(data: any): any {
    if (data.res_status === true) {
      this.snack.open(data.msg, 'Ok', { duration: 5000 });
    }
  }

  transferToSecondAgent(): any {
    const body = {
      peer_type: 'transfer',
      sender_name: this.supportPerson1,
      receiver_name: this.chatname,
      input: 'live agent transfer',
      peer_chat_type: 'agent',
    };

    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessTransferToAgent(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  transferAgentToUser(supportPerson: any): void {
    const body = {
      peer_type: 'insert',
      sender_name: this.loginuserName,
      receiver_name: supportPerson,
      input: 'live agent transfer',
      peer_chat_type: 'agent',
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessTransferToAgent(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  requestStatus(val: any): any {
    const body = {
      peer_type: 'notify_agent',
      sender_name: this.loginuserName,
      receiver_name: this.supportPerson1,
      input: val,
      peer_chat_type: 'agent',
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessRequest(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessRequest(data: any): void {
    if (data.res_status === true) {
    }
  }
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position) {
            this.currentLatitude = position.coords.latitude;
            this.currentLongitude = position.coords.longitude;
            this.locationFlag = 'supported';
          }
        },
        (error) => {
          this.locationFlag = 'denied';
        }
      );
    } else {
      this.locationFlag = 'not supported';
      //alert("Geolocation is not supported by this browser.");
    }
  }
  getRowData() {
    let rowData: any[] = [];
    const nearLocations: any[] = [];
    this.warehouseKey = undefined;

    this.WareHouseLocations.map((item: any) => {
      Object.entries(this.filterData[0]).map(([key, val]) => {
        if (
          (val as string)
            .toString()
            .toLowerCase()
            .includes(item.CAMPUS_NAME.toLowerCase()) === true
        ) {
          this.warehouseKey = key;
        }
      });
      if (this.locationFlag === 'supported') {
        const loc = this.calculateDistance(
          this.currentLatitude,
          this.currentLongitude,
          +item.Lat,
          +item.Long,
          'K'
        );
        nearLocations.push({ distance: loc, CAMPUS_NAME: item.CAMPUS_NAME });
      }
    });
    this.locationCoordinates = [];
    if (this.locationFlag === 'supported') {
      this.locationCoordinates = nearLocations.sort(
        (a, b) => a.distance - b.distance
      );
      if (
        this.entity[this.warehouseKey?.toLowerCase()] === undefined ||
        this.entity[this.warehouseKey?.toLowerCase()] === null
      ) {
        if (this.locationCoordinates[0].distance <= 5) {
          rowData = this.filterData.filter(
            (item: any) =>
              item[Object.keys(this.locationCoordinates[0])[1]] ===
              Object.values(this.locationCoordinates[0])[1]
          );
        } else {
          this.locationCoordinates = [{ distance: 10, CAMPUS_NAME: '' }];
          rowData = this.filterData;
        }
      } else {
        this.locationCoordinates = [{ distance: 10, CAMPUS_NAME: '' }];
        rowData = this.filterData;
      }

      // if(this.locationCoordinates[0].distance <= 5  ){

      //   this.entity[this.warehouseKey.toLowerCase()]  === undefined || null  ? rowData = this.filterData.filter((item:any)=> item[Object.keys(this.locationCoordinates[0])[1]] === Object.values(this.locationCoordinates[0])[1]) : rowData = this.filterData;
      // }else {
      //   this.locationCoordinates = [{distance:10, CAMPUS_NAME : ''}];
      //   rowData =  this.filterData;
      // }
    } else {
      this.locationCoordinates = [{ distance: 10, CAMPUS_NAME: '' }];
      rowData = this.filterData;
    }
    return rowData;
  }
  calculateDistance(lat1: any, lon1: any, lat2: any, lon2: any, unit: any) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      const latitude = (Math.PI * lat1) / 180;
      const longitude = (Math.PI * lat2) / 180;
      const theta = lon1 - lon2;
      const radius = (Math.PI * theta) / 180;
      let dist =
        Math.sin(latitude) * Math.sin(longitude) +
        Math.cos(latitude) * Math.cos(longitude) * Math.cos(radius);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  }
  trackByArtNo(index: number, item: any): number {
    return index;
  }
}
