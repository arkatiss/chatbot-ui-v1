import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import Swal from 'sweetalert2';
import { ChatService } from '../../chat/chatservice/chat.service';
import { PagesService } from '../../pages.service';
import { environment } from '../../../../environments/environment';
import { GeneralService } from '../../../helper/general.service';
import { MessagingService } from '../../../service/messaging.service';
import { ErrorService } from '../../../helper/error.service';

@Component({
  selector: 'app-multiagentdata',
  templateUrl: './multiagentdata.component.html',
  styleUrls: ['./multiagentdata.component.scss'],
})
export class MultiagentdataComponent implements OnInit, OnChanges {
  @Input() acceptedAgentData: any;
  loggedUser: any;
  acceptedData: any[] = [];
  prevLength = 0;
  chatUserName: any;
  inputmsg: any;
  chatType = 'agent';
  timeout: any;
  previousBotConversation: any;
  supportPerson1: any;
  iconUrl = environment.iconUrl;
  imgurl: any;
  imgHeight: any;
  previousUserBotConversation: any;
  inputWidth = '73.32%';
  isTyping = false;
  showChat = true;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef | any;
  @ViewChild('content') content: ElementRef | any;
  displayCustomerName: any;
  constructor(
    private gs: GeneralService,
    private cs: ChatService,
    private msgservice: MessagingService,
    private pageservice: PagesService,
    private err: ErrorService
  ) {
    const data = this.gs.getUserToken();
    this.loggedUser = data[0].user_name;
    const imgUrl = this.gs.getPropertiesUrl();
    this.imgurl = imgUrl.imgPath;
    this.imgHeight = '50px';
  }
  datevalue: any;
  historytime: any[] = [];
  historyData: any[] = [];
  historyDetails: any[] = [];
  showHistoryChat = false;
  showCurrentChat = false;

  ngOnChanges(changes: SimpleChanges | any): void {
    this.acceptedData = [];
    if (
      changes?.acceptedAgentData?.currentValue?.personData !== undefined &&
      changes?.acceptedAgentData?.currentValue?.personData !== null
    ) {
      if (this.acceptedAgentData.previousChatData !== undefined) {
        this.previousUserBotConversation = JSON.parse(
          this.acceptedAgentData.previousChatData
        );
        const data = this.gs.getUserToken();
        this.loggedUser = data[0].user_name;
        this.showCurrentChat = true;
        this.showHistoryChat = false;
        if (this.acceptedAgentData.status === true) {
          this.acceptedData = this.acceptedAgentData.previousData.data;
        } else {
          this.acceptedData = [];
        }
        this.chatUserName = this.acceptedAgentData.personData.receiver_name;
        this.displayCustomerName =
          this.acceptedAgentData.personData.displayname;
      } else {
        this.showHistoryChat = true;
        this.showCurrentChat = false;
        this.loggedUser = this.acceptedAgentData.personData.sender_name;
        this.chatUserName = this.acceptedAgentData.personData.receiver_name;
        this.displayCustomerName =
          this.acceptedAgentData.personData.displayname;
        this.acceptedData = this.acceptedAgentData.previousData.data;
      }
    } else {
      this.acceptedAgentData = [];
      this.acceptedData = [];
      this.displayCustomerName = undefined;
    }
    this.historyData = [];
    this.historyDetails = [];
    this.acceptedData.map((item) => {
      const inptime = item.peer_time.split(' ')[0];
      this.historytime.push({ htime: inptime });
      const objs: any = {};
      const unique = () => {
        const result = [];
        this.historytime.forEach((item: any, i: any) => {
          objs[item['htime']] = i;
        });
        for (let key in objs) {
          let index = objs[key];
          result.push(this.historytime[index]);
        }
        return result;
      };

      this.historytime = unique();
      const obj = {
        body: item.body,
        peer_chat_type: item.peer_chat_type,
        peer_flag: item.peer_flag,
        peer_id: item.peer_id,
        peer_last_seen_time: item.peer_last_seen_time,
        peer_time: item.peer_time,
        receiver_name: item.receiver_name,
        sender_name: item.sender_name,
      };

      this.historyDetails.push(obj);
      this.historyData = [];
      this.historytime.map((subItem: number | any) => {
        if (subItem !== 0) {
          const departmentData: any = [];
          this.historyDetails.map((item: any) => {
            if (subItem['htime'] === item.peer_time.split(' ')[0]) {
              departmentData.push(item);
            }
          });
          const obj = { name: [subItem], data: departmentData };
          this.historyData.push(obj);
        }
      });
    });
  }
  ngOnInit(): void {
    this.msgservice.recievedCloudMessage().subscribe((info: any) => {
      if (info !== undefined && info !== null) {
        if (info.data.peer_chat_type === 'agent') {
          this.pageservice.setAgentStatus(true);
          if (
            info.data.is_notify_agent === 'true' ||
            info.data.is_notify_agent === true
          ) {
            this.supportPerson1 = info.data.sender_name;
            if (info.data.body === 'accept') {
              //  alert('Accepted');
            } else if (info.data.body === 'reject') {
              //alert('Rejected');
            } else {
            }
          } else if (
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
            this.pageservice.setAgentStatus(false);
            this.acceptedData.push(info.data);
            this.updateRetPersonChat();
            setTimeout(() => {
              this.scrollToElement('');
            }, 1000);
          }
        }
      }
    });
  }
  scrollToElement(el: any): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
  updateRetPersonChat(): any {
    const body = {
      peer_type: 'update',
      sender_name: this.loggedUser,
      receiver_name: this.chatUserName,
      peer_chat_type: this.chatType,
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
  sendmessage(): void {
    const usDate = new Date();
    const inputtime = usDate.toLocaleString('en-US', {
      timeZone: 'America/New_York',
    });
    this.acceptedData.push({
      body: this.inputmsg,
      peer_time: inputtime,
      sender_name: this.loggedUser,
    });
    setTimeout(() => {
      this.scrollToElement('');
    }, 1000);
    const body = {
      peer_type: 'insert',
      sender_name: this.loggedUser,
      receiver_name: this.chatUserName,
      input: this.inputmsg,
      peer_chat_type: this.chatType,
    };
    this.inputmsg = '';
    this.cs.sendMessage(body).subscribe(
      (res) => {
        this.onSuccessUsersChat(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  // typingMsg(typing): any {

  //   this.timeout = setTimeout(() => {
  //     if (typing.keyCode !== 13) {
  //       this.typingChat(typing);
  //     }
  //   }, 1400);
  // }
  typingMsg(event: any): void {
    const typing: any = event.target.value;
    const curLength: number = typing.length;
    if (curLength > this.prevLength && this.prevLength === 0) {
      const body = {
        peer_type: 'typing',
        typing: 'true',
        sender_name: this.loggedUser,
        receiver_name: this.chatUserName,
        peer_chat_type: this.chatType,
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
        sender_name: this.loggedUser,
        receiver_name: this.chatUserName,
        peer_chat_type: this.chatType,
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
  }
  onSuccessUsersChat(data: any): void {
    if (data.res_status === true) {
    }
  }
  onErrorr(data: any): void {
    Swal.fire({ title: this.err.handleError(data) });
  }
  changeWidth(val: any): any {
    this.inputWidth = val;
    this.showChat = !this.showChat;
  }
}
