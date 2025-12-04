import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
@Component({
  selector: 'app-buttons',
  templateUrl: './buttons.component.html',
  styleUrls: ['./buttons.component.scss'],
})
export class ButtonsComponent implements OnInit {
  //buttonCssUrl :SafeResourceUrl;
  //styleUrl = environment.cssUrl+'cp-button.css';
  constructor(private sanitizer: DomSanitizer) {
    //  this.buttonCssUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.styleUrl);
  }
  @Input() buttons: any[] = [];
  @Output() sendSelection = new EventEmitter();
  @Input() supportButtons: any[] = [];
  @Output() sendPeerChat = new EventEmitter();
  @Output() ratingChat = new EventEmitter();
  @Input() ratingsButton: any[] = [];
  ngOnInit(): void {}
  onButtonSelect(selectedButton: any): void {
    // TODO: temporary to support title attribute
    this.sendSelection.emit(selectedButton);
  }
  peerSendChat(val: any): void {
    this.sendPeerChat.emit(val);
  }
  ratingChatUser(val: any): void {
    this.ratingChat.emit(val);
  }
}
