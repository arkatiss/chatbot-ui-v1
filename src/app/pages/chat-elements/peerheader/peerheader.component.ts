import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-peerheader',
  templateUrl: './peerheader.component.html',
  styleUrls: ['./peerheader.component.scss'],
})
export class PeerheaderComponent implements OnInit {
  constructor() {}
  @Input() chatpersonname: any;
  @Input() typing: Boolean | any;
  @Output() showMainBotChat = new EventEmitter();
  ngOnInit(): void {}
  showBotChat(): void {
    this.showMainBotChat.emit();
  }
}
