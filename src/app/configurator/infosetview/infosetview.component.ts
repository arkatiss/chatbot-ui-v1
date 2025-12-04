import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';
import { CommonService } from '../../helper/common.service';
export interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-infosetview',
  templateUrl: './infosetview.component.html',
  styleUrls: ['./infosetview.component.scss'],
})
export class InfosetviewComponent implements OnInit {
  domainDetails: any[] = [];
  subDomainDetails: any[] = [];
  addbuttonshow = false;
  infosets: any[] = [];
  infosets2: any[] = [];
  showtoggle = false;
  nodeData: any[] = [];
  logScreen = false;
  jsoneditor = false;
  filename: any;
  Logdata: any;
  subinfydomain: any;
  infydomain: any;
  showorgchart = true;
  showojsoneditor = false;
  showdata: any;
  modalRef: BsModalRef | any;
  file: any;
  fileId: any;
  masterDetails: any[] = [];
  filteredData: any[] = [];
  rowData: any[] = [];
  displayedColumns: any[] = [];
  editorOptions = new JsonEditorOptions();
  editorOptions1 = new JsonEditorOptions();
  selectInfoset: any;
  @ViewChild('editor', { static: true }) editor!: JsonEditorComponent;
  @ViewChild('editor1', { static: true }) editor1!: JsonEditorComponent;
  domainNameControl = new FormControl();
  filteredDomainOptions: Observable<User[]> | any;
  subDomainNameControl = new FormControl();
  filteredSuDomainOptions: Observable<User[]> | any;
  infosetControl = new FormControl();
  filteredInfosetOptions: Observable<User[]> | any;
  constructor(
    private spinner: NgxSpinnerService,
    private common: CommonService,
    public snack: MatSnackBar,
    private cs: ConfigService
  ) {
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.mode = 'tree';
    this.editorOptions.mainMenuBar = true;
    this.editorOptions.navigationBar = true;
    this.editorOptions.statusBar = false;
    this.editorOptions1.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions1.mode = 'tree';
    this.editorOptions1.mainMenuBar = true;
    this.editorOptions1.navigationBar = true;
    this.editorOptions1.statusBar = false;
  }

  ngOnInit(): void {
    this.retrieveDomain();
    this.filteredDomainOptions = this.domainNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.domain)),
      map((name) =>
        name ? this.domainFilter(name) : this.domainDetails.slice()
      )
    );

    this.filteredSuDomainOptions = this.subDomainNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.domain)),
      map((name) =>
        name ? this.subdomainFilter(name) : this.subDomainDetails.slice()
      )
    );
    this.filteredInfosetOptions = this.infosetControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.fileName)),
      map((name) =>
        name.fileName
          ? this.infosetFilter(name.fileName)
          : this.infosets.slice()
      )
    );
  }
  retrieveDomain(): any {
    const body = { chat_bot_type: 'retrieve' };
    this.cs.addDomain(body).subscribe(
      (res: any) => {
        this.onSuccesssRetDomain(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssRetDomain(datas: any): any {
    if (datas.res_status === true) {
      this.domainDetails = datas.data;
    } else {
    }
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    // Swal.fire({
    //   icon: 'error',
    //   text: error
    // });
  }
  selectDomainForInfoset(): any {
    // console.log(this.domainNameControl.value);
    this.nodeData = [];
    this.infosets = [];
    this.jsoneditor = false;
    this.showtoggle = false;
    // this.domainDetails.forEach((element) => {
    //   if (element.domain === val) {
    //     this.subDomainDetails = element.sub_domain;
    //   }
    // });
    this.subDomainNameControl.setValue('');
    this.infosetControl.setValue('');
    this.subDomainDetails = [];
    this.infosets = [];
    this.domainDetails.map((item) => {
      if (item.domain === this.domainNameControl.value) {
        this.subDomainDetails = item.sub_domain;
        this.filteredSuDomainOptions =
          this.subDomainNameControl.valueChanges.pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : value.domain)),
            map((name) =>
              name ? this.subdomainFilter(name) : this.subDomainDetails.slice()
            )
          );
      }
    });
    if (this.subDomainDetails.length > 0) {
      this.addbuttonshow = true;
    }
  }
  changeSubDomainForInfosetView(subdomain: any): any {
    this.nodeData = [];
    this.infosets = [];
    this.jsoneditor = false;
    this.showtoggle = false;
    const body = {
      infoset_type: 'retrieve',
      domain: this.domainNameControl.value,
      sub_domain: subdomain,
    };
    this.cs.retDomSubDomInfoset(body).subscribe(
      (res: any) => {
        this.onSuccessInfoView(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessInfoView(data: any): any {
    if (data.res_status === true) {
      // console.log(data.data);
      this.infosets2 = [];
      this.infosets2 = data.data;
      this.infosets = [];
      for (const a of this.infosets2) {
        const file = a.file.split('.');
        const filename = file[0];
        this.infosets.push({
          file: a.file,
          fileName: filename,
          info_data: a.info_data,
          fileId: a.id,
        });
      }
      // console.log(this.infosets);
    }
  }
  showJsonEditor(val: any): any {
    this.file = val.file;
    this.fileId = val.fileId;
    this.showtoggle = true;
    this.nodeData = val.info_data.infoset_data;
    this.logScreen = true;
    this.jsoneditor = true;
    const file = val.file.split('.');
    this.filename = file[0];
    this.Logdata = val.info_data;
    this.editorOptions.language = 'en';
    this.editorOptions.mode = 'tree';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.statusBar = false;
    this.showorgchart = true;
  }
  switchonChange(enable: boolean, evt: any): any {
    if (enable === true) {
      this.showojsoneditor = true;
      this.showorgchart = false;
    } else {
      this.showorgchart = true;
      this.showojsoneditor = false;
    }
  }
  saveFile(): any {
    let dataSave;
    if (this.showdata === undefined) {
      dataSave = {
        json_format: this.Logdata,
        file: this.filename,
        infoset_type: 'update',
      };
    } else {
      dataSave = {
        json_format: this.showdata,
        file: this.filename,
        infoset_type: 'update',
      };
    }
    const body = dataSave;
    this.cs.saveInfoset(body).subscribe(
      (res: any) => {
        this.onSuccesssSaveFile(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssSaveFile(data: any): any {
    if (data.res_status === true) {
      this.snack.open(data.msg, 'Ok');
      // this.showJsonEditor(this.filename);
    } else {
      this.snack.open(data.msg, 'Ok');
      this.modalRef.hide();
    }
  }
  deleteInfoset(): any {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        const body = { infoset_id: this.fileId, infoset_yml: this.file };
        this.cs.delInfoset(body).subscribe(
          (res: any) => {
            this.onSuccessDelInfoset(res);
          },
          (err: any) => {
            this.onErrorr(err);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your file is safe :)', 'error');
      }
    });
  }
  onSuccessDelInfoset(data: any): any {
    if (data.res_status === true) {
      this.snack.open(data.msg, 'Ok');
      this.infosets = [];
      this.jsoneditor = false;
      this.showorgchart = false;
      this.showtoggle = false;
      this.domainDetails = [];
      this.subDomainDetails = [];
      this.nodeData = [];
      this.retrieveDomain();
    } else {
      this.snack.open(data.msg, 'Ok');
    }
  }
  showTables(): any {
    const body = {
      domain: this.domainNameControl.value,
      sub_domain: this.subDomainNameControl.value,
      master_data_type: 'retrieve_data',
    };
    this.cs.chatbotMasterData(body).subscribe(
      (res: any) => {
        this.onSuccesShowTables(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesShowTables(data: any): any {
    if (data.res_status === true) {
      this.rowData = data.data;
      this.filteredData = this.rowData;

      this.displayedColumns = [
        { name: 'Attribute Name', prop: 'attr_name' },
        { name: 'Operation Type', prop: 'operation_type' },
        { name: 'Operation Value', prop: 'oper_value' },
        { name: 'Description', prop: 'description' },
      ];
    }
  }
  tabChanged(event: any): any {
    if (event.index === 2 && event.tab.textLabel === 'Json View') {
      this.showojsoneditor = true;
    } else {
      this.showojsoneditor = false;
    }
  }
  filterDatatable(event: any): void {
    const val = event.target.value.toLowerCase();
    const colsAmt = this.displayedColumns.length;
    const keys = Object.keys(this.filteredData[0]);
    // this.rowData = this.filteredData.filter((item: any) => {
    //   for (let i = 0; i < colsAmt; i++) {
    //     if (
    //       item[keys[i]].toString().toLowerCase().indexOf(val) !== -1 ||
    //       !val
    //     ) {
    //       return true;
    //     }
    //   }
    // });
    this.rowData = this.filteredData.filter((item: any) => {
      for (let i = 0; i < colsAmt; i++) {
        if (!val || item[keys[i]].toString().toLowerCase().includes(val)) {
          return true;
        }
      }
      return false;
    });
  }
  getData(data: any): any {}
  private domainFilter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.domainDetails.filter((option) =>
      option.domain.toLowerCase().includes(filterValue)
    );
  }
  private subdomainFilter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.subDomainDetails.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  private infosetFilter(name: string): User[] {
    const filterValue = name.toLowerCase();
    return this.infosets.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  onbackToFiles() {}
  displayFn(option: any): string {
    if (!option) return '';
    return option.fileName || option.domain || option;
  }
}
