import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  Component,
  OnInit,
  ViewChild,
  Input,
  SecurityContext,
  ElementRef,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GeneralService } from '../../helper/general.service';
@Component({
  selector: 'app-docviewer',
  templateUrl: './docviewer.component.html',
  styleUrls: ['./docviewer.component.scss'],
})
export class DocviewerComponent implements OnInit {
  @Input()
  externalUrl: SafeResourceUrl | any;

  linktext: any;
  showdocument = false;
  showurl = false;
  @ViewChild('inlinePdfViewer', { static: false })
  public inlinePdfViewer: any;
  @ViewChild('iframe') iframe: ElementRef | any;
  months = [
    'http://localhost:4200/#/application?type=app_viz&appName=Test_App',
    'http://localhost:4200/#/application?type=app_viz&appName=asset tracker',
  ];
  constructor(
    private http: HttpClient,
    private general: GeneralService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.general.getFormData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.showdocument = true;
        if (info.form_type === 'link') {
          const substring = '&&';
          if (info.entry_forms.includes(substring)) {
            const data = info.entry_forms.split('&&');
            const docId = data[1];
            this.linktext = data[0];
            const body = {
              user_name: 'vendorportal@cswg.com',
              password: 'vendor@123',
              doc_id: docId,
            };
            this.http
              .post<any>(this.linktext, body, {
                responseType: 'arraybuffer' as 'json',
              })
              .subscribe((resp) => {
                console.log(resp);
                const file = new Blob([resp], { type: 'application/pdf' });
                this.inlinePdfViewer.pdfSrc = file;
                this.inlinePdfViewer.refresh();
              });
            this.showurl = false;
          } else {
            this.showurl = true;
            let url = '';
            url = info.entry_forms;
            const filterString = info?.filterString;
            //this.externalUrl = '';
            const random = Math.floor(Math.random() * this.months.length);
            // 'http://localhost:5000/#/application?type=app_viz&appName=Beth4 test'
            //this.externalUrl = this.sanitizer.sanitize(SecurityContext.URL, this.months[random]);

            //let myImg = document.getElementById('myId') as HTMLImageElement;

            this.loadIframe(url, filterString);
            //this.externalUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.months[random]);
          }
          //  this.linktext = info.entry_forms;
        }
      }
    });
  }
  loadIframe(url: any, filterString: any): any {
    this.externalUrl = this.sanitizer.sanitize(SecurityContext.URL, url);
    const refreshIframe: any = document.getElementById(
      'iframe'
    ) as HTMLIFrameElement;
    refreshIframe?.contentDocument.location.reload();
    let link = '';
    link = url + '&filterString=' + filterString;
    const obj = link.replace(/%22/g, '"');
    const inputJson = obj.split('%20').join(' ');
    sessionStorage.setItem('appVizUrl', inputJson);
    this.externalUrl = this.sanitizer.sanitize(
      SecurityContext.URL,
      url + '&filterString=' + filterString
    );
  }
}
