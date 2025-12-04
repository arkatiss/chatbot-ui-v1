import { PagesService } from './../pages.service';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  HostListener,
  ChangeDetectionStrategy,
  ElementRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { VoicerecognitionService } from '../../service/voicerecognition.service';
import { MatSidenav } from '@angular/material/sidenav';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { GeneralService } from '../../helper/general.service';
type AOA = any[][];

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [VoicerecognitionService],
})
export class MainComponent implements OnInit {
  @ViewChild('dashwidth') dashwidth!: ElementRef;
  elasticData: any;
  userName: any;
  imgurl: any;
  iconUrl: any;
  hidetoggle = false;
  showtoggle = true;
  searchbtncolor;
  dashBoardWidth = '75%';
  chatWidth: any;
  constructor(
    private router: Router,
    private pageservice: PagesService,
    @Inject(DOCUMENT) private document: Document,
    public service: VoicerecognitionService,
    private spinner: NgxSpinnerService,
    private gs: GeneralService
  ) {
    const imgUrl = this.gs.getPropertiesUrl();

    this.imgurl = imgUrl.imgPath;

    if (this.imgurl.includes('cs') === true) {
      this.searchbtncolor = '#d92337';
    } else {
      this.searchbtncolor = '#737373';
    }
    this.iconUrl = environment.iconUrl;
  }
  @ViewChild('sidenav') sidenav: MatSidenav | any;
  @HostListener('window:scroll', ['$event'])
  clrcode: any;
  userRole: any;
  showGridComponent = false;
  showSelector = 'showMainComponent';
  hideGrid = true;
  moveTab: any;
  acceptedAgentData: any;
  getacceptedagentData: any;
  charts = '#ededed';
  ngOnInit(): void {
    this.pageservice.getShowView().subscribe((info: any) => {
      if (info !== undefined && info !== null) {
        if (Object.keys(info).length > 0) {
          this.showSelector = info;
          if (info === 'showGridComponent' || info === 'showAllocGrid') {
            this.showGridComponent = true;
            this.hideGrid = false;
          } else {
            this.showGridComponent = false;
            this.hideGrid = true;
          }
          if (info === 'showMainComponent') {
            this.charts = '#ededed';
          } else {
            this.charts = '#ffffff';
          }
        }
      }
    });
    //this.userRole =  this.gs.getUserRoleData();

    this.gs.getUserRoleData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          this.userRole = info;
        } else {
        }
      }
    });
    this.service.init();
    this.changeTheme('#7ea3e0');
    const data = this.gs.getUserToken();
    this.userName = data[0].user_name;
    // this.gs.getFireBaseToken().subscribe(token => {
    //   if (Object.keys(token).length > 0) {
    //     const body = {
    //       user_name: this.userName,
    //       fcm_token: token,
    //       context : {'user-agent': {browser: this.getBrowserName(), browser_version: this.getBrowserVersion()}, 'user-interface': 'web-ui'}
    //     };
    //     this.gs.sendFirebaseToken(body).subscribe((res) => {
    //     });
    //   }
    // });
  }

  moveSelectedTab(val: any): void {
    this.moveTab = val;
  }

  agentAcceptedData(data: any): void {
    this.acceptedAgentData = data;
  }
  cancelRequest(): any {
    this.spinner.hide();
  }

  changeTheme(primary: any): any {
    this.clrcode = primary;
    document.documentElement.style.setProperty('--primary-color', primary);
  }
  chatwindow(data: any): any {
    this.pageservice.setWindow(data);
    this.router.navigateByUrl('/pages/home');
  }
  getacceptedData(data: any): void {
    this.getacceptedagentData = data;
  }
  cancel(): any {
    this.spinner.hide();
  }

  switchonChange(enable: boolean, evt: any): any {
    this.pageservice.switchData(enable);
  }
  collapse(val: any): any {
    if (val === 'collapse') {
      this.hidetoggle = true;
      this.showtoggle = false;
      // document.getElementById('dashwidth').style.width = '100%';
      this.dashwidth.nativeElement.style.width = '100%';
    } else if (val === 'expand') {
      this.hidetoggle = false;
      this.showtoggle = true;
      // document.getElementById('dashwidth').style.width = '75%';
      this.dashwidth.nativeElement.style.width = '75%';
    }
  }
}
