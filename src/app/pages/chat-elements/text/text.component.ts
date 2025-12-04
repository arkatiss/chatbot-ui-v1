import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { environment } from '../../../../environments/environment';
@Component({
  selector: 'app-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  textCssUrl: SafeResourceUrl | any;
  styleUrl = environment.cssUrl + 'cp-text.css';
  constructor(private sanitizer: DomSanitizer) {
    // this.textCssUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.styleUrl);
  }
  @Input() messages: any;
  @Input() timestamp: string[] | any;
  @Input() inpmessages: any;
  @Input() inptimestamp: any;
  @Input() agentfirstletter: any;
  @Input() peermessages: any;
  @Input() user: any;
  @Input() loginname: any;
  @Input() custFirst: any;
  @Input() agentResponse: any;
  @Input() iconurl: any;
  @Input() loguser: any;
  @Input() isTypings: Boolean | any;
  ngOnInit(): void {}
}
