import { PagesService } from '../pages.service';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { ScrollToBottomDirective } from '../scroll-to-bottom.directive';
import * as XLSX from 'xlsx';
import { DOCUMENT } from '@angular/common';
import { GeneralService } from '../../helper/general.service';
import { VoicerecognitionService } from '../../service/voicerecognition.service';
import { CdkDragStart } from '@angular/cdk/drag-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { DatamarkService } from './service/datamark.service';
import { CommonService } from '../../helper/common.service';
import { MessagingService } from '../../service/messaging.service';
import { UrlConfigService } from '../../helper/url-config.service';
import { ErrorService } from '../../helper/error.service';

type AOA = any[][];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  mainuser: any;
  heading: any;
  notcurrent: any;
  currentshow: any;
  inputmsg: any;
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
  json: any[] = [];
  chatdatalayouts: any[] = [];
  datevalue: any;
  msg: any;
  datamarksdatewise: any[] = [];
  showspinner: any;
  timestamp: string | any;
  activeUsers: any[] = [];
  showperson = false;
  showperson2 = true;
  chatname: any;
  userName: any;
  timer: any = null;
  chatnamedisplay: any;
  imgurl: any;
  lastMsg = false;
  undoMsg = false;
  enterword: any;
  appsshow = 'show';
  public dragging: boolean | any;
  support: any;
  supportUser: any;
  enablevoicechat = false;
  enablecontrol = true;
  cnt = 1;
  enterbox = true;
  checkedtoggle = false;
  rcnumber: any;
  rcmsg: any;
  chatbotmode = 'normal';
  supportType: any;
  agentName: any;
  agentChatMsg: any;
  typeOfUser = '';
  peerChatType: any;
  loginuserName: any;
  userNameLtr: any;
  agentShortName: any;
  isTyping = false;
  prevLength = 0;
  title1: any;
  title2: any;
  showchatbot = false;
  showcsbot = false;
  botMsg: any;
  supportPersonBool: any;
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
    private ds: DatamarkService,
    private error: ErrorService,
    public url: UrlConfigService
  ) {
    this.service.init();
    // const time = new Date();
    // const inputtime = this.calcTime('-4');
    // this.timestamp = inputtime;
    const data = this.general.getUserToken();
    this.loginuserName = data[0].user_name;
    this.agentShortName = data[0].user_name;
    this.urlsubstring = this.url.getUrls();
  }

  @ViewChild('scrollMe') private myScrollContainer: ElementRef | any;
  scroll: ScrollToBottomDirective | any;
  iconBgColor: any;
  iconBorder: any;
  imgHeight: any;
  inputtime: any;
  endtime: any;
  starttime: any;
  totalJson: any;
  urlsubstring;
  @ViewChild('abcd') abcd!: ElementRef;
  @ViewChild('shw') shw!: ElementRef;
  @ViewChild('shw2') shw2!: ElementRef;
  @ViewChild('showarrow') showarrow!: ElementRef;
  @ViewChild('cardval') cardval!: ElementRef;
  ngOnInit(): void {
    window.addEventListener(
      'build',
      this.customEventListenerFunction.bind(this),
      true
    );
    this.msgservice.getTempData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
      }
    });
    const userToken = this.general.getUserToken();
    // const userName = userToken[0].user_name;
    // this.general.getFireBaseToken().subscribe(token => {
    //   if (Object.keys(token).length > 0) {
    //     const body = {
    //       user_name: userName,
    //       fcm_token: token,
    //       context : {'user-agent': {browser: this.getBrowserName(), browser_version: this.getBrowserVersion()}, 'user-interface': 'web-ui'}
    //     };
    //     this.general.sendFirebaseToken(body).subscribe((res:any) => {
    //     });
    //   }
    // });

    this.getBrowserName();
    const imgUrl = this.general.getPropertiesUrl();
    this.imgurl = imgUrl.imgPath;
    if (this.imgurl.includes('cs') === true) {
      this.showchatbot = false;
      this.showcsbot = true;
      this.botMsg = [
        'Hi, I am C&S Virtual Assistant. Let me know how I can help and I’ll do my best to assist you!',
        'I would recommend you to start with "sales for today" or "service level for today"',
      ];
      this.iconBgColor = '#fff';
      this.iconBorder = '1px solid #d31e25';
      this.imgHeight = '50px';

      const usDate = new Date();
      this.inputtime = usDate.toLocaleString('en-US', {
        timeZone: 'America/New_York',
      });
      this.timestamp = this.inputtime;
    } else {
      this.showchatbot = true;
      this.showcsbot = false;
      this.botMsg = [
        'Hi, I am Intellobot. Let me know how I can help and I’ll do my best to assist you!',
      ];
      this.iconBgColor = '#0079c9';
      this.iconBorder = 'none';
      this.imgHeight = '';
      const time = new Date();
      this.inputtime = time;
      this.timestamp = this.inputtime;
    }
    // this.imgurl = environment.imageUrl;
    this.pageservice.getChatData().subscribe((info: any) => {
      // this.chatResponse = [];
      if (info.length > 0) {
        this.chatResponse = info;
      }
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
    this.pageservice.getWindow().subscribe((inf: any) => {
      if (inf.length > 0) {
        if (inf === 'open') {
          const idval: any = document.getElementById('abcd');
          idval.style.opacity = '1';
        } else if (inf === 'close') {
          const idval: any = document.getElementById('abcd');
          idval.style.opacity = '0';
        }
      }
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
            this.updateRetPersonChat();
            this.isTyping = false;
            this.peerChatType = 'normal';
          }

          // this.updateRetPersonChat();
        }
        // else if(info.data['peer_chat_type'] === 'agent'){

        //   this.chatResponse.push(info.data);
        //   this.peerChatType = 'agent';
        //   if(info.data['is_updated'] !== 'true' && info.data['is_updated'] !== undefined){
        //     this.updateRetPersonChat();
        //   }

        // }
      }
    });
    const sessionState = this.general.getSessionState();
    if (sessionState !== null) {
      this.chatResponse = sessionState;
    }
  }
  customEventListenerFunction(data: any): void {}

  public handleDragStart(event: CdkDragStart): void {
    this.dragging = true;
  }
  Chatclick(): void {
    if (
      this.chatname === undefined ||
      this.chatname === '' ||
      this.chatname === null
    ) {
      if (this.inputmsg.trim() === '' || this.inputmsg === ' undefined') {
        alert('Enter or Say Something');
      } else {
        const time = new Date();
        let inputtime;
        if (this.imgurl.includes('cs') === true) {
          inputtime = time.toLocaleString('en-US', {
            timeZone: 'America/New_York',
          });
        } else {
          inputtime = time;
        }

        //const inputtime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });

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
        this.spinner.show();
        this.msgdata = [];
        this.keys = [];
        this.valuess = [];
        this.json = [];
        this.outputreport = [];
        this.chatdatalayouts = [];
        const newArray = this.chatResponse.map((o) => {
          return { name: o.inputData, courseid: o.outputData };
        });
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
            },
          };
        }
        this.enterword = '';
        this.undoMsg = false;
        this.supportType = '';
        this.ds.sendMessage(body).subscribe(
          (res: any) => {
            this.onSuccesss(res, body);
          },
          (err: any) => {
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
        this.updateSupportGroup();
        const ratings = [
          { support_user: this.support, rating: '1' },
          { support_user: this.support, rating: '2' },
          { support_user: this.support, rating: '3' },
          { support_user: this.support, rating: '4' },
          { support_user: this.support, rating: '5' },
        ];
        const obj = {
          inputData: this.inputmsg,
          outputData: [
            "We'll be happy to assist you with anything else. Have a great day ahead!",
            'How would you rate your support experience?',
          ],
          ratings: ratings,
        };
        if (this.supportPersonBool === true) {
          const body = {
            peer_type: 'insert',
            sender_name: this.loginuserName,
            receiver_name: this.chatname,
            input: this.inputmsg,
            peer_chat_type: this.peerChatType,
          };
          this.ds.sendMessage(body).subscribe(
            (res: any) => {
              this.onSuccessUsersChat(res);
            },
            (err: any) => {
              this.onErrorr(err);
            }
          );
          this.chatResponse.push(obj);
        } else {
          this.chatResponse = [];
          this.chatResponse = this.general.getSessionState();
          this.chatResponse.splice(-1);
          this.supportPersonBool = false;
        }
        // this.chatResponse.push(obj);
        this.stopTimer2();
        this.chatname = '';
        setTimeout(() => {
          this.scrollToElement('');
        }, 1000);
        this.supportUser = this.support;
        this.support = '';
      } else {
        const token = this.general.getUserToken();
        const userName = token[0].user_name;

        const time = new Date();
        if (this.peerChatType === 'normal') {
          this.peerResponse.push({
            body: this.inputmsg,
            peer_time: time,
            sender_name: userName,
            peer_flag: 0,
          });
        } else {
          // const inputtime = time.toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false });
          const usDate = new Date();
          const inputtime = usDate.toLocaleString('en-US', {
            timeZone: 'America/New_York',
          });
          this.chatResponse.push({
            inputData: this.inputmsg,
            inptimestamp: inputtime,
          });
        }
        const body = {
          peer_type: 'insert',
          sender_name: userName,
          receiver_name: this.chatname,
          input: this.inputmsg,
          peer_chat_type: this.peerChatType,
        };
        this.ds.sendMessage(body).subscribe(
          (res: any) => {
            this.onSuccessUsersChat(res);
          },
          (err: any) => {
            this.onErrorr(err);
          }
        );
      }
    }
  }

  calcTime(offset: any): any {
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const nd = new Date(utc + 3600000 * offset);
    return nd.toLocaleString();
  }
  onSuccessUsersChat(data: any): any {
    if (data.res_status === true) {
      this.inputmsg = '';
    }
  }

  onSuccesss(data: any, body: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.showspinner = false;

      if (this.inputmsg === 'bye' || this.inputmsg === 'Bye') {
        // document.getElementById('abc').style.opacity = '0';
        this.abcd.nativeElement.style.opacity = '0';
      }
      this.chatbgcolor = true;
      this.showfile = true;
      this.inputmsg = '';
      this.service.text = '';
      if (data.support) {
        this.msgdata = data.data;
        this.support = data.support;
        if (this.support.length > 0) {
          this.agentName = this.msgdata.support_person;
          const layout = [
            { key: 'yes', value: data.support },
            { key: 'no', value: '' },
          ];
          const obj = {
            outputData: [
              'Our support person  ' +
                this.msgdata.support_person +
                '  is ready to assist you',
              'Do you want to chat ?',
            ],
            peerchat: layout,
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
            peerchat: layout,
          });
        }
      } else {
        if (this.lastMsg === true) {
          this.chatResponse = [];
          this.lastMsg = false;
        } else {
          this.msgdata = data.data;
          if (this.msgdata.length === 0) {
            const obj = { outputData: [data.data.msg] };
            this.chatResponse.push(obj);
          } else {
            this.general.setData(data);
            const b = this.msgdata.output.type;
            const cc = this.msgdata.output.cb_type;
            const dd = this.msgdata.output.type;
            const list = this.msgdata.output.list;
            const outtime = this.msgdata.output.time;
            this.datevalue = outtime;
            const qstns = this.msgdata.output.question;
            const layoutvals = ['yes', 'no'];
            const prompt = this.msgdata.output.prompt;
            let OutputMsgData = this.msgdata.output.data;
            OutputMsgData = String(OutputMsgData);
            OutputMsgData = OutputMsgData.split('@#@#');
            if (b === 'cb_report') {
              this.chatResponse.push({
                outputData: OutputMsgData,
                qstn: qstns,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
              });
              this.keys = [];
              this.valuess = [];
              this.outputreport = [];
              this.outputreport.push(this.msgdata.output.main_window[0]);
              this.outputreport.push(
                this.msgdata.output.main_window[this.msgdata.length - 1]
              );
              this.outputreportt = this.msgdata.output.main_window;
              for (let cc = 0; cc < this.outputreportt.length; cc++) {
                this.valuess.push(this.outputreportt[cc]);
              }
              this.pageservice.storevalues(this.outputreportt);
              // this.msgdata.output.entry_forms = [];
              // this.general.setFormData(this.msgdata.output.entry_forms);
              this.router.navigateByUrl('/pages/main');
              this.pageservice.setShowView('showGridComponent');
            } else if (cc === 'app_build' && dd === undefined) {
              this.chatResponse.push({
                outputData: OutputMsgData,
                layout: this.msgdata.output.layouts,
                outtimestamp: outtime,
                dateformat: outtime,
                qstn: qstns,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
              });
            } else if (list) {
              this.chatResponse.push({
                outputData: OutputMsgData,
                layout: this.msgdata.output.list,
                outtimestamp: outtime,
                dateformat: outtime,
                qstn: qstns,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
              });
            } else if (cc === 'data_entry' && dd === 'selected') {
              this.chatResponse.push({
                outputData: OutputMsgData,
                layout: this.msgdata.output.entry_forms,
                outtimestamp: outtime,
                dateformat: outtime,
                qstn: qstns,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
              });
              const obj = {
                form_type: this.msgdata.output.form_type,
                entry_forms: this.msgdata.output.entry_forms,
              };
              if (this.msgdata.output.form_type === 'form') {
                this.general.setFormData(obj);
                this.outputreportt = [];
                this.pageservice.storevalues(this.outputreportt);
                this.router.navigateByUrl('/pages/main');
                this.pageservice.setShowView('showFormComponent');
              } else if (this.msgdata.output.form_type === 'link') {
                this.general.setFormData(obj);
                this.router.navigateByUrl('/pages/main');
                this.pageservice.setShowView('showDocsComponent');
              }
            } else if (dd === 'selected') {
              this.chatResponse.push({
                outputData: OutputMsgData,
                layout: this.msgdata.output.templates,
                outtimestamp: outtime,
                dateformat: outtime,
                qstn: qstns,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
              });
            } else if (cc === 'data_entry') {
              const substring = 'Enter';
              if (this.msgdata.output.entry_forms[0].includes(substring)) {
                this.enterword = this.msgdata.output.entry_forms[0];
                this.chatResponse.push({
                  outputData: OutputMsgData,
                  emailword: this.msgdata.output.entry_forms,
                  outtimestamp: outtime,
                  dateformat: outtime,
                  qstn: qstns,
                  yn: layoutvals,
                  uniqueeid: this.msgdata.output.unique_id,
                  promptVal: prompt,
                });
              } else {
                this.chatResponse.push({
                  outputData: OutputMsgData,
                  layout: this.msgdata.output.entry_forms,
                  outtimestamp: outtime,
                  dateformat: outtime,
                  qstn: qstns,
                  yn: layoutvals,
                  uniqueeid: this.msgdata.output.unique_id,
                  promptVal: prompt,
                });
              }
            } else {
              this.chatResponse.push({
                outputData: OutputMsgData,
                outtimestamp: outtime,
                dateformat: outtime,
                qstn: qstns,
                yn: layoutvals,
                uniqueeid: this.msgdata.output.unique_id,
                promptVal: prompt,
              });
            }
            this.supportType = this.msgdata.output.support_type;
            this.pageservice.setChatData(this.chatResponse);
          }
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
        this.general.getHttpUrl('serverHost') + this.urlsubstring.chatListapi,
      Input: body,
      query: 'NA',
      Time: seconds + ' Sec',
    };
    this.totalJson = { Keyword: obj };
    Object.assign(
      this.totalJson.Keyword,
      { intent: this.msgdata.output.intent },
      { entity: this.msgdata.output.entity },
      { url: this.msgdata.output.url },
      { payload: this.msgdata.output.payload },
      { dataviz_url: this.msgdata.output.dataviz_url }
    );
    this.pageservice.setDiagnosticsData(this.totalJson);
  }
  trackByArtNo(index: number, chatResponse: any): string {
    return chatResponse.uniqueeid;
  }
  calculateTime(start: any, end: any): any {
    let timeDiff = end - start;
    timeDiff /= 1000;
    const seconds = Math.round(timeDiff);
    return seconds;
  }
  app_data_get(val: any): any {
    if (this.lastMsg === true) {
      if (val === 'yes') {
        this.inputmsg = 'chat_@reset';
        this.Chatclick();
        this.agentChatMsg = '';
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
      }
    } else {
      this.inputmsg = val;
      this.Chatclick();
    }
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
  }
  startTimer2(): any {
    this.stopTimer2();
    this.timer = setInterval(() => {
      this.retrievePersonChat2();
    }, 2000);
  }
  stopTimer2(): any {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  stopService(): any {
    this.service.stop();
    // if (this.service.text ===  ' undefined' || this.service.text.trim() === '') {
    //   console.log('a');
    //   this.service.text = '';
    //   this.inputmsg = '';
    //   alert('Enter or Say Something');
    // }
    // else {
    //   this.inputmsg = this.service.text;
    //   this.Chatclick();
    // }
    this.starthide = true;
    this.stophide = false;
  }
  closewindow(): any {
    // document.getElementById('abcd').style.opacity = '0';
    this.abcd.nativeElement.style.opacity = '0';
  }
  openwindw(evt: any): any {
    if (evt.target.checked === true) {
      // document.getElementById('abcd').style.opacity = '1';
      if (!this.abcd) return;
      this.abcd.nativeElement.style.opacity = '1';
    } else if (evt.target.checked === false) {
      if (!this.abcd) return;
      // document.getElementById('abcd').style.opacity = '0';
      this.abcd.nativeElement.style.opacity = '0';
    }
  }
  logout(): any {
    const body = {};
    this.ds.logout(body).subscribe(
      (res: any) => {
        this.onSuccessslogout(res);
      },
      (err: any) => {
        this.onErrorrLogout(err);
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

  onErrorrLogout(error: any): any {
    sessionStorage.removeItem('appVizUrl');
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
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  getActiveUsers(): any {
    const body = {};
    this.ds.getActiveUsers(body).subscribe(
      (res: any) => {
        this.onSuccessActiveUsers(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessActiveUsers(data: any): any {
    if (data.res_status === true) {
      //  this.spinner.hide();
      const users = data.data;
      this.activeUsers = [];
      for (const a of users) {
        this.activeUsers.push({
          user: a.name,
          username: a.user_name,
          chatFlag: a.chat_flag,
        });
      }
      //  this.activeUsers = this.getUnique(this.activeUsers,'username');
    } else {
      Swal.fire({
        text: this.error.handleError(data),
      });
    }
  }

  showBotChat(): any {
    this.showperson2 = true;
    this.showperson = false;
    this.appsshow = 'show';
    // document.getElementById('cardval').style.height = 'calc(100vh - 220px)';
    this.chatname = '';
    this.peerResponse = [];
    this.stopTimer();
    this.shw.nativeElement.style.display = 'block';
    this.shw2.nativeElement.style.display = 'none';
    this.showarrow.nativeElement.style.display = 'block';
  }
  updateSupportGroup(): any {
    const body = { support_user: this.support };
    this.ds.updateSupportGroup(body).subscribe(
      (res: any) => {
        this.onSuccesssUpdatesupport(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssUpdatesupport(data: any): any {
    // console.log(data);
  }
  startTimer(): any {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.retrievePersonChat();
    }, 2000);
  }
  stopTimer(): any {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  chatUser(val: any): any {
    this.pageservice.setStatusUser(val.username);
    const data = this.general.getUserToken();
    const userName = data[0].user_name;
    const user = userName.split('@');
    this.userNameLtr = val.user[0];
    this.showperson = true;
    this.showperson2 = false;
    this.chatname = val.username;
    this.chatnamedisplay = val.user;
    this.appsshow = 'hide';
    this.peerChatType = 'normal';
    this.retrievePersonChat();
    this.shw.nativeElement.style.display = 'none';
    this.shw2.nativeElement.style.display = 'block';
    this.showarrow.nativeElement.style.display = 'block';
  }
  retrievePersonChat(): any {
    const data = this.general.getUserToken();
    this.userName = data[0].user_name;
    const userName = data[0].user_name;
    const body = {
      peer_type: 'retrieve',
      sender_name: userName,
      receiver_name: this.chatname,
      peer_chat_type: 'normal',
    };
    this.ds.sendMessage(body).subscribe(
      (res: any) => {
        this.onSuccessUsersRetChat(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUsersRetChat(data: any): any {
    if (data.res_status === true) {
      this.peerResponse = data.data;
      this.typeOfUser = data.data[0].peer_chat_type;
      this.updateRetPersonChat();
    } else {
      this.peerResponse = [];
    }
  }
  retrievePersonChat2(): any {
    const data = this.general.getUserToken();
    this.userName = data[0].user_name;
    const userName = data[0].user_name;
    const body = {
      peer_type: 'retrieve',
      sender_name: userName,
      receiver_name: this.chatname,
      peer_chat_type: 'agent',
    };
    this.ds.sendMessage(body).subscribe(
      (res: any) => {
        this.onSuccessUsersRetChat2(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUsersRetChat2(data: any): any {
    if (data.res_status === true) {
      this.chatResponse = data.data;
      this.agentChatMsg = this.agentName;
      this.typeOfUser = data.data[0].peer_chat_type;
      this.updateRetPersonChat();
    } else {
      this.chatResponse = [];
    }
  }
  updateRetPersonChat(): any {
    const data = this.general.getUserToken();
    this.userName = data[0].user_name;
    const userName = data[0].user_name;
    const body = {
      peer_type: 'update',
      sender_name: userName,
      receiver_name: this.chatname,
      peer_chat_type: this.peerChatType,
    };
    this.ds.sendMessage(body).subscribe(
      (res: any) => {
        this.onSuccessUserUpdate(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUserUpdate(data: any): any {}
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
    // this.inputmsg = 'chat_@reset';
    this.lastMsg = true;
    // this.Chatclick();
    // setTimeout(() => {
    //   this.inputmsg = 'help me';
    //   this.lastMsg = 'help me';
    //   this.Chatclick();
    // }, 1000);
  }
  undoChat(): any {
    this.undoMsg = true;
    this.inputmsg = 'chat_@undo';
    this.Chatclick();
    // chat_@undo
  }
  scrollToElement(el: any): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
  scrollHandler(event: any, val: any): any {
    if (val === 'show') {
      if (event.isTrusted === true) {
        // this.showarrow = true;
        // document.getElementById('showarrow').style.display = 'block';
        this.showarrow.nativeElement.style.display = 'block';
      } else {
        //  this.showarrow = false;
        this.showarrow.nativeElement.style.display = 'none';
      }
    } else if (val === 'hide') {
      this.showarrow.nativeElement.style.display = 'none';
    } else {
      this.showarrow.nativeElement.style.display = 'none';
    }
  }
  peerChat(val: any): any {
    if (val.key === 'yes') {
      if (val.value === 'navigate') {
        const obj = { form_type: 'form', entry_forms: 'callbackform' };
        this.general.setFormData(obj);
        this.router.navigateByUrl('/pages/main');
        this.pageservice.setShowView('showFormComponent');
      } else if (val.value === 'notnavigate') {
      } else {
        if (this.support.length > 0) {
          this.showperson = false;
          this.appsshow = 'hide';
          // document.getElementById('shw').style.display = 'none';
          // document.getElementById('shw2').style.display = 'block';
          // document.getElementById('showarrow').style.display = 'block';
          // document.getElementById('cardval').style.height = 'calc(100vh - 220px)';
          this.shw.nativeElement.style.display = 'none';
          this.shw2.nativeElement.style.display = 'block';
          this.showarrow.nativeElement.style.display = 'block';
          this.cardval.nativeElement.style.height = 'calc(100vh - 220px)';
          this.showperson2 = true;
          this.chatname = val.value;
          const username = val.value.split('@');
          this.chatnamedisplay = username[0];
          this.agentChatMsg = this.agentName;
          this.peerChatType = 'agent';
          this.retrievePersonChat2();
          //this.startTimer2();
        } else {
          alert('your chat session has been ended ');
        }
      }
    } else {
      if (val.value === 'notnavigate') {
        this.chatResponse.push({
          inputData: 'no',
          outputData: ['Please Continue The Chat'],
        });
        setTimeout(() => {
          this.scrollToElement('');
        }, 1000);
      } else {
        // alert('your chat session has been ended ');
        this.chatResponse.push({
          inputData: 'no',
          outputData: ['Please Continue The Chat'],
        });
        setTimeout(() => {
          this.scrollToElement('');
        }, 1000);
        this.updateSupportGroup();
      }
    }
  }
  ratingUserChat(val: any): any {
    if (
      this.supportUser !== '' &&
      this.supportUser !== undefined &&
      this.supportUser !== null
    ) {
      const body = { support_user: val.support_user, input: val.rating };
      this.ds.sendMessage(body).subscribe(
        (res: any) => {
          // this.onSuccesss(res);
          alert('Thank you for giving valuable feedback');
          this.chatResponse = [];
          this.chatResponse = this.general.getSessionState();
          this.botMsg = [
            'Hi, I am C&S Virtual Assistant. Let me know how I can help and I’ll do my best to assist you!',
            'I would recommend you to start with "sales for today" or "service level for today"',
          ];
          if (this.chatResponse.length > 0) {
            if (this.chatResponse.length === 1) {
              this.chatResponse.splice(-1);
            } else {
              this.chatResponse.splice(-1);
              this.chatResponse.splice(-1);
            }
          }
          this.supportPersonBool = false;
        },
        (err: any) => {
          this.onErrorr(err);
        }
      );
      this.supportUser = '';
    } else {
      alert('your rating is already submitted');
    }
  }
  enableVoiceChat(chat: any): any {
    if (chat === 'enable') {
      this.enablevoicechat = true;
      this.enablecontrol = false;
      this.startService();
    } else {
      this.enablevoicechat = false;
      this.enablecontrol = true;
    }
  }
  switchonChange(enable: boolean, evt: any): any {
    this.pageservice.switchData(enable);
  }

  keyPressNumbers(event: any): any {
    const pattern = /[0-9\+\-\ ]/;

    const inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode !== 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  closedialog(): any {
    this.dialog.closeAll();
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
  typingChat(event: any): any {
    const typing: any = event.target.value;
    const curLength: number = typing.length;
    if (
      this.peerChatType === 'normal' &&
      this.chatname !== undefined &&
      this.chatname !== '' &&
      this.chatname !== null
    ) {
      if (curLength > this.prevLength && this.prevLength === 0) {
        const body = {
          peer_type: 'typing',
          typing: 'true',
          sender_name: this.loginuserName,
          receiver_name: this.chatname,
          peer_chat_type: this.peerChatType,
        };
        this.ds.sendMessage(body).subscribe(
          (res: any) => {
            this.onSuccessUsersChat(res);
          },
          (err: any) => {
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
        };
        this.ds.sendMessage(body).subscribe(
          (res: any) => {
            this.onSuccessUsersChat(res);
          },
          (err: any) => {
            this.onErrorr(err);
          }
        );
      }
      this.prevLength = curLength;
    }
  }
}

// window.addEventListener("beforeunload", function (e) {

//   var confirmationMessage = "\o/";
//   e.returnValue = confirmationMessage;
//   return confirmationMessage;

// });
