import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { ChatService } from '../../chat/chatservice/chat.service';
import { PagesService } from '../../pages.service';
import { GeneralService } from '../../../helper/general.service';
import { MessagingService } from '../../../service/messaging.service';
@Component({
  selector: 'app-multiagentlist',
  templateUrl: './multiagent.component.html',
  styleUrls: ['./multiagent.component.scss'],
})
export class MultiagentListComponent implements OnInit, OnChanges {
  [x: string]: any;
  @Input() acceptedaAgentData: any;
  usersList: any[] = [];
  loggedUser: any;
  chatResponse: any;
  @Output() getSelectedChat = new EventEmitter();
  selectedUserChat: any;
  agentchatenabled = false;
  notificationData: any[] = [];
  userNotifications: any[] = [];
  notarray: any[] = [];
  agentNormalNotification: any[] = [];
  hideNotification: any;
  agentchatarray: any[] = [];
  selectedAgentChatIdx: any;
  showRecentChat = true;
  userNames: any[] = [];
  userNameControl = new FormControl();
  filteredOptions: Observable<any> | any;
  agentNameControl = new FormControl();
  start = new FormControl();
  end = new FormControl();
  effectiveDate = new FormControl('');
  agentfilteredOptions: Observable<any> | any;
  rowData: any[] = [];
  agentEmail: any;
  userEmail: any;
  selectsubtabclass = 'recent';
  showHistoryChat = false;
  closedUsersList: any[] = [];
  chatNameDisplay: any;
  constructor(
    private ps: PagesService,
    private gs: GeneralService,
    private cs: ChatService,
    private spinner: NgxSpinnerService,
    private msgservice: MessagingService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.acceptedaAgentData !== undefined &&
      this.acceptedaAgentData !== null
    ) {
      this.usersList = this.acceptedaAgentData;
      this.usersList.map((item) => {
        Object.assign(item, {
          firstnameltr: item.loginFullName
            .match(/\b(\w)/g)
            .join('')
            .toUpperCase(),
        });
      });
    }
  }
  ngOnInit(): void {
    const data = this.gs.getUserToken();
    this.loggedUser = data[0].user_name;

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
        } else {
          if (info.data.peer_chat_type === 'agent') {
            this.notificationData = [];
            this.userNotifications = [];
            this.notarray.push(info.data);
            this.getNotificationsData();
          }
        }
      }
    });
  }

  getNotificationsData(): any {
    let normalchatarray = [];
    this.agentchatarray = [];
    for (let a = 0; a < this.notarray.length; a++) {
      if (this.notarray[a].peer_chat_type === 'normal') {
        normalchatarray.push(this.notarray[a].sender_name);
      } else {
        this.agentchatarray.push(this.notarray[a].sender_name);
      }
    }
    const mySet = new Set(normalchatarray);
    normalchatarray = [...mySet];
    const mySet2 = new Set(this.agentchatarray);
    this.agentchatarray = [...mySet2];
    const agentcount: { [key: string]: number } = {};
    if (this.agentchatarray.length > 0) {
      for (let i = 0; i < this.agentchatarray.length; i++) {
        for (let b = 0; b < this.notarray.length; b++) {
          if (
            this.agentchatarray[i] === this.notarray[b].sender_name &&
            this.notarray[b].peer_chat_type === 'agent'
          ) {
            if (agentcount[this.agentchatarray[i]] === undefined) {
              agentcount[this.agentchatarray[i]] = 1;
            } else {
              agentcount[this.agentchatarray[i]] =
                agentcount[this.agentchatarray[i]] + 1;
            }
          }
        }
        if (this.hideNotification !== this.agentchatarray[i]) {
          this.agentNormalNotification.push({
            email: this.agentchatarray[i],
            count: agentcount[this.agentchatarray[i]],
            type: 'agent',
            user_name: this.agentchatarray[i].split('@')[0],
          });
        }
      }
    }
    let emailArray: any[] = [];
    this.agentNormalNotification.map((item) => {
      emailArray.push(item.email);
    });
    const email = new Set(emailArray);
    emailArray = [...email];
    emailArray.map((test) => {
      const countList: any[] = [];
      this.agentNormalNotification.map((item) => {
        if (item.email === test) {
          countList.push(item.count);
        }
      });
      const count = this.max(countList);
      this.usersList.map((info) => {
        if (info.username === test) {
          Object.assign(info, { msgcount: count });
        }
      });
    });
    // this.closedUsersList.map((item) => {
    //   Object.assign(item, {firstnameltr: item.name.match(/\b(\w)/g).join('').toUpperCase()});
    // });
  }
  max(countList: any) {
    return Math.max(...countList);
  }

  showagentchat(val: any, i: any): any {
    this.selectedAgentChatIdx = i;
    this.hideNotification = val.username;
    this.usersList.map((item) => {
      if (item.username === val.username) {
        delete item.msgcount;
      }
    });
    this.agentNormalNotification = Array.from(
      this.agentNormalNotification
        .reduce((m, t) => m.set(t.email, t), new Map())
        .values()
    );
    const idxId = this.agentNormalNotification.findIndex(
      (i) => i.email === val.username
    );
    this.agentNormalNotification.splice(idxId, 1);
    // const idx = this.notarray.findIndex(i => i.sender_name === val.username);
    // this.notarray.splice(idx,1);
    this.agentchatarray = Array.from(
      this.agentchatarray.reduce((m, t) => m.set(t, t), new Map()).values()
    );
    const index = this.agentchatarray.findIndex((i) => i === val.username);
    this.agentchatarray.splice(index, 1);
    this.notarray = Array.from(
      this.notarray
        .reduce((m, t) => m.set(t.sender_name, t), new Map())
        .values()
    );
    const idx = this.notarray.findIndex((i) => i.sender_name === val.username);
    this.notarray.splice(idx, 1);
    this.ps.setShowView('showMultiagentData');
    this.retrieveAgentChat(val);
  }
  retrieveAgentChat(val: any): void {
    this.spinner.show();
    const body = {
      peer_type: 'retrieve',
      sender_name: this.loggedUser,
      receiver_name: val.username,
      peer_chat_type: val.typeofUser,
    };
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessRetAgentChat(res, body, val.userData, val.loginFullName);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessRetAgentChat(
    data: any,
    body: any,
    userData: any,
    displayName: any
  ): void {
    this.spinner.hide();
    Object.assign(body, { displayname: displayName });
    if (data.res_status === true) {
      this.getSelectedChat.emit({
        previousData: data,
        personData: body,
        status: data.res_status,
        previousChatData: userData,
      });
    } else {
      this.getSelectedChat.emit({
        previousData: data.msg,
        personData: body,
        status: data.res_status,
        previousChatData: userData,
      });
    }
  }
  closeUserChat(val: any, i: any): void {
    const body = { support_user: this.loggedUser, chat_flag: 0 };
    this.cs.updateSupportGroup(body).subscribe(
      (res) => {
        this.onSuccesssUpdatesupport(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
    const body2 = { sender_name: this.loggedUser, receiver_name: val.username };
    this.cs.updateAgentStatus(body2).subscribe(
      (res) => {
        this.onSuccesssUpdateAgentStatus(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
    const idx = this.usersList.findIndex((i) => i === val.username);
    this.usersList.splice(idx, 1);
    this.getSelectedChat.emit({
      previousData: undefined,
      personData: undefined,
      status: undefined,
      previousChatData: undefined,
    });
  }
  onSuccesssUpdatesupport(data: any): any {}
  onSuccesssUpdateAgentStatus(data: any): any {}
  onErrorr(data: any): void {
    Swal.fire({ title: data.msg });
  }
  getuserNames(): any {
    this.spinner.show();
    const body = {};
    this.cs.getActiveUsers(body).subscribe(
      (res) => {
        this.onSuccessuserNames(res);
      },
      (err) => {
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
        this.userNames.push({
          email: a.user_name,
          name: a.name,
          status: a.status,
          chatFlag: a.chat_flag,
          chatStatus: a.chat_flag_status,
        });
      }
      this.userNames.push({
        email: this.loggedUser,
        name: this.loggedUser.split('@')[0],
      });
      this.userNames = this.getUnique(this.userNames, 'email');
      this.filteredOptions = this.userNameControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this.filter(name) : this.userNames.slice()))
      );
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
  filter(name: string): any {
    const filterValue = name.toLowerCase();

    return this.userNames.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  getSupportGroups(): any {
    this.spinner.show();
    const body = { support_type: 'retrieve' };
    this.cs.support(body).subscribe(
      (res) => {
        this.onSuccessSupport(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessSupport(data: any): any {
    if (data.res_status === true) {
      this.rowData = data.data;
      this.agentfilteredOptions = this.agentNameControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this.filter(name) : this.rowData.slice()))
      );
    }
  }
  showSelStartDate(evt: any): void {}
  fetchData(val: any, i: any): void {
    this.chatNameDisplay = val.name;
    this.spinner.show();
    this.selectedAgentChatIdx = i;
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    const startDate = this.formatDateToUs(new Date());
    const endDate = this.formatDateToUs(date.toLocaleDateString());
    const body = {
      agent_name: this.loggedUser,
      client_name: val.user_name,
      date: [endDate, startDate],
    };
    this.cs.fetchHistory(body).subscribe(
      (res) => {
        this.onsuccessFetchData(res, body);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onsuccessFetchData(data: any, body: any): void {
    this.spinner.hide();
    if (data.res_status === true) {
      this.ps.setShowView('showMultiagentData');
      const ChangedBody = {
        receiver_name: body.client_name,
        sender_name: body.agent_name,
        displayname: this.chatNameDisplay,
      };
      this.getSelectedChat.emit({
        previousData: data,
        personData: ChangedBody,
        status: data.res_status,
        previousChatData: undefined,
      });
    } else {
      Swal.fire({ text: data.msg });
    }
  }
  formatDateToUs(date: any): any {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
  }
  getSelectedAgent(val: any): any {
    this.agentEmail = val.email;
  }
  getSelectedUser(val: any): void {
    this.userEmail = val.email;
  }
  showRecent(val: any): void {
    this.selectsubtabclass = val;

    if (val === 'recent') {
      this.showRecentChat = true;
      this.showHistoryChat = false;
    } else {
      this.getClosedClients();
      this.showHistoryChat = true;
      this.showRecentChat = false;
    }
  }
  getClosedClients(): void {
    this.spinner.show();
    const body = {};
    this.cs.getClosedClients(body).subscribe(
      (res) => {
        this.onSuccessClients(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessClients(data: any): void {
    this.spinner.hide();
    if (data.res_status === true) {
      this.closedUsersList = data.data;
      this.closedUsersList.map((item) => {
        Object.assign(item, {
          firstnameltr: item.name
            .match(/\b(\w)/g)
            .join('')
            .toUpperCase(),
        });
      });
    } else {
      Swal.fire({ title: data.msg });
    }
  }
}
