import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-peerheader',
  templateUrl: './peerheader.component.html',
  styleUrls: ['./peerheader.component.scss'],
})
export class PeerheaderComponent implements OnInit,OnChanges {
  constructor(    private cdr: ChangeDetectorRef) {}

  @Input() chatpersonname: any;
  @Input() typing: Boolean | any;
  @Output() showMainBotChat = new EventEmitter();
  ngOnChanges(changes: SimpleChanges): void {
   this.cdr.detectChanges();
  }
  ngOnInit(): void {}
  showBotChat(): void {
    this.showMainBotChat.emit();
  }
}
