import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Output() sendMsg = new EventEmitter();
  @Output() sendTyping = new EventEmitter();
  @Output() getUsers = new EventEmitter();
  @Output() chatWithUser = new EventEmitter();
  @Output() switchBotMode = new EventEmitter();
  @Output() undoMsg = new EventEmitter();
  @Output() resetMsgChat = new EventEmitter();
  @Output() showMainBotChat = new EventEmitter();
  @Input() usersList: any[] = [];
  @Input() showagentTransferIcon: Boolean | any;
  @Input() showCustomModes: Boolean | any;
  @Input() transferAgentNames: any;
  @Input() enablecontrols: Boolean | any;
  @Input() enablevoicechats: Boolean | any;
  @Input() imgLink: any;
  @Output() enableVoiceChats = new EventEmitter();
  @Output() switchModes = new EventEmitter();
  @Output() transferToAgents = new EventEmitter();
  @Output() goToMiniChat = new EventEmitter();
  @Output() switchToPrompt = new EventEmitter();
  @Input() entertextbox: Boolean | any;
  @Output() transferChats = new EventEmitter();
  footerCssUrl: SafeResourceUrl;
  @Input() showUserIcon = true;
  @Input() showBotIcon = false;
  @Input() showPeeragentChat: Boolean | any;
  @Output() closeUserChats = new EventEmitter();
  styleUrl = environment.cssUrl + 'cp-footer.css';
  imgHeight: any;
  @Input() bgColor: any = '#ffffff';
  @Input() starthide: any = false;
  @Input() stophide: any = false;
  constructor(private sanitizer: DomSanitizer) {
    this.footerCssUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.styleUrl
    );
  }
  inputmsg: any;
  ngOnInit(): void {
    if (this.imgLink.includes('cs') === true) {
      this.imgHeight = '35px';
    } else {
      this.imgHeight = '23px';
    }
  }
  sendmessage(): void {
    this.sendMsg.emit(this.inputmsg);
    this.inputmsg = '';
  }
  typingMsg(event: any): void {
    const val: any = event.target.value;
    this.sendTyping.emit(val);
  }
  getActiveUsers(): void {
    this.getUsers.emit();
  }
  chatToUser(val: any): void {
    this.chatWithUser.emit(val);
    this.showUserIcon = false;
    this.showBotIcon = true;
  }
  switchCustomMode(val: any): void {
    this.switchBotMode.emit(val);
  }
  undoChat(): void {
    this.undoMsg.emit();
  }
  resetChat(): void {
    this.resetMsgChat.emit();
  }
  showBotChat(): void {
    this.showMainBotChat.emit();
    this.showUserIcon = true;
    this.showBotIcon = false;
  }
  enableVoiceChat(val: any): void {
    this.enableVoiceChats.emit(val);
  }
  switchMode(val: any): void {
    this.switchModes.emit(val);
  }
  transferToAgent(): void {
    this.transferToAgents.emit();
  }
  chatwindow(val: any): void {
    this.goToMiniChat.emit(val);
  }
  transferChat(): void {
    this.transferChats.emit();
  }
  closeUserChat(): void {
    //this.showPeeragentChat = false;
    this.closeUserChats.emit();
  }
  // switchonChange(val,val2): void {
  //   const obj = {val,val2};
  //   console.log(obj);
  // //  this.switchToPrompt.emit(obj)
  // }
  stopService() {}
  startService() {}
}
