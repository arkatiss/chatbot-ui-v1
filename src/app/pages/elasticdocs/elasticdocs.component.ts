import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { PagesService } from '../pages.service';

@Component({
  selector: 'app-elasticdocs',
  templateUrl: './elasticdocs.component.html',
  styleUrls: ['./elasticdocs.component.scss'],
})
export class ElasticdocsComponent implements OnInit, OnChanges {
  msg: string | any;
  showmsg = false;
  showdata = false;
  docsdata: any[] = [];
  displayedColumns: string[] = [];
  dataSource: any;
  searchKeyWord: any;
  @Input() elasticsData: any;
  constructor(private pageservice: PagesService) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (this.elasticsData !== undefined || this.elasticsData !== null) {
      this.searchKeyWord = this.elasticsData.keyword;
      this.docsdata = this.elasticsData.data.data;
      this.showmsg = false;
      this.showdata = true;
    }
  }

  ngOnInit(): void {
    if (this.elasticsData !== undefined || this.elasticsData !== null) {
      this.searchKeyWord = this.elasticsData.keyword;
      this.docsdata = this.elasticsData.data.data;
      this.showmsg = false;
      this.showdata = true;
    }

    // this.pageservice.getAllDocs().subscribe(info => {

    //   this.searchKeyWord = info.keyword;
    //   if (Object.keys(info).length > 0) {
    //     if (info.data.data.length > 0) {
    //       console.log('data found');
    //       this.showmsg = false;
    //       this.showdata = true;
    //       //this.searchKeyWord = info.keyword;
    //       this.docsdata = info.data.data;
    //       this.dataSource = info.data.data;
    //       this.displayedColumns = ['filename','filesize','filetype','view'];
    //       console.log(this.dataSource);
    //     } else {
    //       console.log('no data found');
    //       this.showmsg = true;
    //       this.showdata = false;
    //       document.getElementById('cntv').style.height = 'calc(100vh)';
    //       //this.searchKeyWord = info.keyword;
    //       this.msg = 'no data found';
    //     }
    //   }else{
    //     console.log(info);
    //   }

    // });
  }
  downloadPdf(a: any): any {
    const byteCharacters = atob(a.filedata);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: 'application/pdf;base64' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  }
}
