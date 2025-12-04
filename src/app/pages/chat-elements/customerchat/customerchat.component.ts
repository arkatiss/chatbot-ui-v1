import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-customerchat',
  templateUrl: './customerchat.component.html',
  styleUrls: ['./customerchat.component.scss'],
})
export class CustomerchatComponent implements OnInit {
  constructor(private sanitizer: DomSanitizer) {}
  @Input() customerChat: any;
  @Input() username: any;
  @Input() iconurl: any;
  @Input() loginusername: any;
  @Input() agentchatmsg: any;
  textCssUrl: any;
  @Input() supportpersonbool: Boolean | any;
  @Output() ratingCustChat = new EventEmitter();
  @Input() showpersonHide: boolean | any;
  @Output() closeUserChats = new EventEmitter();
  styleUrl = environment.cssUrl + 'chat.css';
  @Input() Typing: boolean | any;
  ngOnInit(): void {
    this.textCssUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.styleUrl
    );
  }
  ratingUserChat(val: any): void {
    this.ratingCustChat.emit(val);
  }
  closeUserChat(): void {
    this.closeUserChats.emit();
  }
}
