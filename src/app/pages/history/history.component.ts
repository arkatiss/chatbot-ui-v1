import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoggingService } from '../../helper/logging.service';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { ApicallService } from '../apiservice/apicall.service';
import { ExcelService } from '../../helper/excel.service';
import { GeneralService } from '../../helper/general.service';
import { ErrorService } from '../../helper/error.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  historyData: any[] = [];
  searchText: string = '';
  dateval: any;
  historyDetails: any[] = [];
  historydiv = false;
  datevalue: any;
  historytime: any[] = [];
  diagnosticsData: any;
  searchString: any;
  open = true;
  close = false;
  exceldata: any[] = [];
  fileName: string = 'SheetJS.xlsx';
  @ViewChild('content') content: ElementRef | any;
  sessionId: any;
  userId: any;
  historyMainData: any;
  dateUnique: any[] = [];
  allHistoryData: any[] = [];
  imgurl: any;
  dateInput: any;
  agentShortName: any;
  imgHeight: any;
  // private logService : LoggingService,
  constructor(
    public dialog: MatDialog,
    private logService: LoggingService,
    public spinner: NgxSpinnerService,
    private excel: ExcelService,
    private api: ApicallService,
    public gs: GeneralService,
    private error: ErrorService
  ) {}

  ngOnInit(): void {
    const imgUrl = this.gs.getPropertiesUrl();
    this.imgurl = imgUrl.imgPath;
    this.getHistoryData();
    const data = this.gs.getUserToken();
    this.agentShortName = data[0].user_name;

    if (this.imgurl.includes('cs') === true) {
      this.imgHeight = '50px';
    } else {
      this.imgHeight = '';
    }
  }
  openDiagnostics(diagnosticsPopup: any): any {
    this.diagnosticsData = this.logService.getDiagnosticsData();
    delete this.diagnosticsData.jsonData;
    this.dialog.open(diagnosticsPopup, { width: '800px', disableClose: true });
  }
  openclose(val: any): any {
    if (val === 'open') {
      this.open = false;
      this.close = true;
    } else if (val === 'close') {
      this.open = true;
      this.close = false;
    }
  }
  export(): void {
    this.exceldata = [];
    for (let i = 0; i < this.historyData.length; i++) {
      this.exceldata = this.historyData[i].data;
    }
    this.excel.exportAsExcelFile(this.exceldata, 'Download');
    /* generate worksheet */
    // const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(historyvalues);

    // /* generate workbook and add the worksheet */
    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // /* save to file */
    // XLSX.writeFile(wb, this.fileName);
    // this.htmlToPdf();
  }
  // htmlToPdf(): any {
  //   const doc = new jsPDF();
  //   const ta = document.getElementById('pdfSink');
  //   doc.fromHTML(this.content.nativeElement, function () {
  //     doc.save("obrz.pdf");
  //   });
  // }
  // public downloadAsPDF(): any {
  //   const doc = new jsPDF();

  //   const specialElementHandlers = {
  //     '#pdfSink': function (element, renderer) {
  //       return true;
  //     }
  //   };

  //   const pdfTable = this.content.nativeElement;

  //   doc.fromHTML(pdfTable.innerHTML, 15, 15, {
  //     width: 190,
  //     'elementHandlers': specialElementHandlers
  //   });

  //   doc.save('tableToPdf.pdf');
  // }

  getHistoryData(): any {
    const body = {};
    this.api.getHistoryData(body).subscribe(
      (res: any) => {
        this.onSuccessshis(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }

  onSuccessshis(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      // this.historydiv = true;
      const dateObj = data.data;
      this.dateUnique = [];
      dateObj.map((item: any) => {
        const a = item.split('-');
        this.dateUnique.push({
          fullvalue: a[0] + '-' + a[1] + '-' + a[2],
          month: a[0],
          date: a[1],
          year: a[2],
        });
        const objs: any = {};
        const unique = () => {
          const result = [];
          this.dateUnique.forEach((item: any, i: any) => {
            objs[item['month']] = i;
          });
          for (let key in objs) {
            let index = objs[key];
            result.push(this.dateUnique[index]);
          }
          return result;
        };
        this.historyMainData = unique();
      });
      // const objs = {};
      //  const unique = () => {
      //       const result = [];
      //       this.historytime.forEach((item, i) => {
      //         objs[item['htime']] = i;
      //       });
      //       for (let key in objs) {
      //         let index = objs[key];
      //         result.push(this.historytime[index]);
      //       }
      //       return result;
      //     };

      //     this.historytime = unique();

      // if (data.data.length > 0) {
      //   this.historyDetails = [];
      //   this.historytime = [];
      //   this.historydiv = true;
      //   data.data.map((item => {
      //     const inptime = item.input.time;
      //     const inputtime = inptime.split(' ');
      //     const outtime = item.output.time;
      //     const outputtime = outtime.split(' ');

      //     this.datevalue = outtime;
      //     this.historytime.push({ htime: outputtime[0] });
      //     const objs = {};
      //     const unique = () => {
      //       const result = [];
      //       this.historytime.forEach((item, i) => {
      //         objs[item['htime']] = i;
      //       });
      //       for (let key in objs) {
      //         let index = objs[key];
      //         result.push(this.historytime[index]);
      //       }
      //       return result;
      //     };

      //     this.historytime = unique();
      //     const obj = {
      //       inptimestamp: inputtime[1], input: item.input.data, output: item.output.data,
      //       outtimestamp: outputtime[1], outputtime: outputtime[0]
      //     };

      //     this.historyDetails.push(obj);
      //     this.historyData = [];
      //     this.historytime.map((subItem: number) => {
      //       if (subItem !== 0) {
      //         const departmentData = [];
      //         this.historyDetails.map((item) => {
      //           if (subItem['htime'] === item.outputtime) {
      //             departmentData.push(item);
      //           }
      //         });
      //         const obj = { name: [subItem], data: departmentData };
      //         this.historyData.push(obj);

      //       }
      //     });

      //   }));
      // }

      // else {
      //   this.historydiv = false;
      // }
    } else {
      Swal.fire({
        text: this.error.handleError(data),
      });
    }
  }
  getMonthData(data: any, month: any): any {
    this.allHistoryData = [];
    this.dateUnique.map((item) => {
      if (item !== 0) {
        if (month === item['month']) {
          this.allHistoryData.push(item['fullvalue']);
        }
      }
    });
  }
  openHistory(dateInput: any): any {
    this.dateInput = dateInput;
    this.spinner.show();
    const body = { date_input: dateInput };
    this.api.getHistoryData(body).subscribe(
      (res: any) => {
        this.onSuccessOpen(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessOpen(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      const objs: any = {};
      const unique = () => {
        const result = [];
        this.historytime.forEach((item, i) => {
          objs[item['htime']] = i;
        });
        for (let key in objs) {
          let index = objs[key];
          result.push(this.historytime[index]);
        }
        return result;
      };
      this.historytime = unique();
      if (data.data.length > 0) {
        this.historyDetails = [];
        this.historytime = [];
        this.historydiv = true;
        data.data.map((item: any) => {
          const inptime = item.input.time;
          const inputtime = inptime.split(' ');
          const outtime = item.output.time;
          const outputtime = outtime.split(' ');

          this.datevalue = outtime;
          this.historytime.push({ htime: outputtime[0] });
          const objs: any = {};
          const unique = () => {
            const result = [];
            this.historytime.forEach((item, i) => {
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
            inptimestamp: inputtime[1],
            input: item.input.data,
            output: item.output.data,
            outtimestamp: outputtime[1],
            outputtime: outputtime[0],
          };

          this.historyDetails.push(obj);
          this.historyData = [];
          this.historytime.map((subItem: any) => {
            if (subItem !== 0) {
              const departmentData: any[] = [];
              this.historyDetails.map((item) => {
                if (subItem['htime'] === item.outputtime) {
                  departmentData.push(item);
                }
              });
              const obj = { name: [subItem], data: departmentData };
              this.historyData.push(obj);
            }
          });
        });
      }
    } else {
      this.spinner.hide();
      this.historydiv = false;
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  searchHistory(): any {
    this.spinner.show();
    const body = { search_data: this.searchString };
    this.api.getSearchedHistoryData(body).subscribe(
      (res: any) => {
        this.onSuccessOpen(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  // onSuccessSearch(data): any {
  //   if (data.res_status === true) {
  //     this.spinner.hide();
  //     console.log(data);
  //     this.historyData = [];
  //     this.historyData.push({data: data.data});
  //   }else {
  //     this.spinner.hide();
  //   }
  // }

  onTextChange(value: any): void {
    this.searchString = value;
    if (this.searchString === '') {
      this.openHistory(this.dateInput);
    }
  }
}
