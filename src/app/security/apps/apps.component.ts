// import { CellEditingStartedEvent, CellEditingStoppedEvent, ColumnApi, GridOptions, RowEditingStartedEvent, RowEditingStoppedEvent } from '@ag-grid-community/all-modules';
// import { AllModules } from '@ag-grid-enterprise/all-modules';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SecurityService } from '../service/security.service';
import { GeneralService } from '../../helper/general.service';
import {
  ColumnApi,
  GridOptions,
  RowEditingStartedEvent,
  RowEditingStoppedEvent,
  CellEditingStartedEvent,
  CellEditingStoppedEvent,
} from 'ag-grid-community';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
})
export class AppsComponent implements OnInit {
  constructor(
    private ss: SecurityService,
    public spinner: NgxSpinnerService,
    private snack: MatSnackBar,
    public dialog: MatDialog,
    private gs: GeneralService,
    private formBuilder: FormBuilder
  ) {
    this.filteredDbOptions = this.NewValue.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.domain)),
      map((name) =>
        name ? this.domainFilter(name) : this.dbListDetails.slice()
      )
    );

    this.openOrderGridOptions = {
      onRowDoubleClicked: this.enableButton,
      columnDefs: this.columnDefs,
      rowData: null,
    };
    //this.showUpdateBtn = false;
  }
  appList: string[] = [];
  connector: any;
  tableName: any;
  gridApi: any;
  gridColumnApi!: ColumnApi;
  // modules = AllModules;
  modules: any;
  columnDefs: any;
  defaultColDef = {
    enableRowGroup: true,
    enablePivot: true,
    enableValue: true,
    sortable: true,
    resizable: true,
    filter: true,
  };
  sidebar = false;
  sortingOrder: any[] = [];
  autoGroupColumnDef: { width: number } | any;
  rowGroupPanelShow: any;
  pivotPanelShow: any;
  pivotColumnGroupTotals: any;
  pivotRowTotals: any;
  rowData: any[] = [];
  columns: any[] = [];
  showGrid = false;
  editType: any;
  pkey: any;
  ObjKeys: any[] = [];
  columnName: any;
  OldValue: any;
  arrjson: any[] = [];
  updateOn: any;
  gridGroupEditEvents: any[] = [];
  displayedColumns: any[] = [];
  dataSource: MatTableDataSource<any> | any;
  isModalShown = false;
  recordLength: any;
  openOrderGridOptions: GridOptions | any;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator | any;
  @ViewChild(MatSort, { static: false }) sort: MatSort | any; //
  @ViewChild('autoShownModal', { static: false }) autoShownModal:
    | ModalDirective
    | any;
  showUpdateBtn = false;
  totalNewRowsData: {} | any;
  appName: any;
  enableRangeSelection = true;
  retrColNames: any[] = [];
  typeofRow: any;
  screenData: any;
  NewValue = new FormControl();
  filteredDbOptions: Observable<any[]>;
  dbListDetails: any[] = [];
  DBList: any[] = [];
  filterString: any;
  sessionAppName: any;
  showAddrow = true;
  imageArray: any[] = [];
  uploadForm: FormGroup | any;
  imgurl: any;
  @ViewChild('fileInput', { static: false }) fileInput: ElementRef | any;
  finalFields: any[] = [];
  inputFields: any[] = [];
  panelOpenState: any;
  createFields: any;
  dynamicUrl: any;
  searchfilterString: any;
  primaryId: any;
  viewFields = [];
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize | any;

  minimizeHeader = true;
  minimizeGridHeader = true;
  gridHeadCol = '1';
  minimizeGrid = true;
  rowSelection: 'single' | 'multiple' = 'multiple';

  actionBtns = [];
  selectedNodes: any[] = [];
  homemenu: any;
  permissions: any;
  showActions: any;
  role: any;
  permisssions = [];
  ngOnInit() {
    const imgUrl = this.gs.getPropertiesUrl();

    this.imgurl = imgUrl.imgPath;
    // const loginInfo = JSON.parse(sessionStorage.getItem('token'));

    //  if (loginInfo[0].user_roles.length === 0) {
    //    this.permissions = 'hide';
    //    this.showActions = false;
    //  } else {
    //    this.role = loginInfo[0].user_roles;

    //    this.role.map((item)=> {
    //      const appList = JSON.parse(item.app_name);
    //      appList.map((test)=> {
    //        this.permisssions.push(test);
    //      });
    //    });

    //    if(this.permisssions.includes('APP_VIZ')) {
    //      this.role.map((item) => {
    //        if(JSON.parse(item.app_name).includes('APP_VIZ')) {
    //        this.permissions = item.permissions;
    //      }
    //      });
    //    } else {
    //      this.permissions = 'hide';
    //      this.showActions = false;
    //    }
    //  }
    //this.getRoles();
    let splitStoredCriteria1;
    const tempLink = sessionStorage.getItem('json');
    if (tempLink !== null && tempLink !== undefined && tempLink !== '') {
      if (tempLink.includes('app?') === true) {
        splitStoredCriteria1 = tempLink.split('type=appViz&');
        if (splitStoredCriteria1[1] !== undefined) {
          if (splitStoredCriteria1[1].includes('name=') === true) {
            const splitKeywordStr = splitStoredCriteria1[1].split('name=');
            const splitKeyword = splitKeywordStr[1].split('&');
            if (
              splitKeyword[0] !== 'undefined' &&
              splitKeyword[0] !== null &&
              splitKeyword[0] !== undefined
            ) {
              this.sessionAppName = splitKeyword[0];
              sessionStorage.setItem('appname', this.sessionAppName);
            } else {
              this.getAppNames();
            }
          }
          if (splitStoredCriteria1[1].includes('search=') === true) {
            const splitFilterStr = splitStoredCriteria1[1].split('search=');
            if (
              splitFilterStr[1] !== undefined &&
              splitFilterStr[1] !== null &&
              splitFilterStr[1] !== 'undefined'
            ) {
              this.filterString = splitFilterStr[1];
            } else {
            }
          }
        } else {
          this.getAppNames();
        }
      } else {
      }
    }
    const appname = sessionStorage.getItem('appname');
    if (appname !== null && appname !== undefined && appname !== '') {
      this.runApp(appname, '');
    } else {
      this.getAppNames();
    }
    this.homemenu = sessionStorage.getItem('showmenu');
    sessionStorage.removeItem('json');
    this.uploadForm = this.formBuilder.group({
      profile: [''],
    });
  }
  getRoles(): void {
    const data = this.gs.getUserToken();
    const sessionId = data[0].session_id;
    const userName = data[0].user_name;
    const body = {
      app_viz_type: 'retrieve',
      email: userName,
      user_name: userName,
      session_id: sessionId,
    };

    this.ss.vizroles(body).subscribe(
      (res: any) => {
        this.onSuccessRoles(res);
      },
      (err: any) => {
        // this.onErrorr(err);
      }
    );
  }

  private domainFilter(name: string): any {
    const filterValue = name.toLowerCase();
    if (
      this.DBList !== undefined &&
      this.DBList.length > 0 &&
      this.DBList.length !== 0
    ) {
      return this.DBList.filter((option) =>
        option.toLowerCase().includes(filterValue)
      );
    }
  }
  clearData() {
    this.finalFields.map((item: any) => {
      item.value = '';
    });
  }
  onSuccessRoles(res: any) {
    if (res.res_status === true) {
      this.permissions = res.data[0].permissions[0];
    }
  }
  ShareLink(val: any): void {
    const dataid = 'name=' + this.appName;
    const datatype = 'type=appViz';
    const enableSearch = 'search=' + this.searchfilterString;
    const prsnturl = window.location.href;
    const res = prsnturl.split('/#/');
    const link = res[0] + '/#/app';
    let URL;
    if (
      this.appName !== undefined &&
      this.appName !== null &&
      this.appName !== ''
    ) {
      if (
        this.searchfilterString !== undefined &&
        this.searchfilterString !== null &&
        this.searchfilterString !== ''
      ) {
        URL = link + '?' + datatype + '&' + dataid + '&' + enableSearch;
      } else {
        URL = link + '?' + datatype + '&' + dataid;
      }
    } else {
      URL = link + '?' + datatype;
    }

    //const URL = link + '?' + datatype +  '&' + dataid + '&' + enableSearch ;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = URL;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snack.open('Link Copied successfully', 'Ok', { duration: 1000 });
    sessionStorage.setItem('sharedUrl', URL);
  }

  enableButton(params: any): void {
    //this.typeofRow = 'edit';
    const updatebutton: any = document.getElementById('updateID');
    updatebutton.click();
  }
  getAppNames(): void {
    // const sessionId = this.appdata.getToken().session_id;
    // const userName = this.appdata.getToken().user_name;
    // const body = {
    //   app_viz_type: 'retrieve',
    //   email: userName,
    //   user_name: userName,
    //   session_id: sessionId
    // };

    this.ss.getAppData('').subscribe(
      (res: any) => {
        this.onSuccessAppNames(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );

    // this.api.getRoles(body).subscribe(
    //   (res:any) => {
    //     this.onSuccessAppNames(res);
    //   },
    //   (err:any) => {
    //     this.onErrorr(err);
    //   }
    // );
  }
  onSuccessAppNames(data: any): void {
    if (data.res_status === true) {
      // data.data.map((item) => {
      //   this.appList = item.appname;
      // });
      this.appList = data.data;
    } else {
      Swal.fire({
        icon: 'error',
        text: data.msg,
      });
    }
  }
  runApp(url: any, type: any): void {
    this.sessionAppName = url;
    if (url !== undefined && url !== null) {
      if (type === 'info') {
      } else {
        this.appName = url;
      }
      this.connector = '';
      this.tableName = '';
      this.ss.getAppData(url).subscribe(
        (res: any) => {
          this.onSuccessRunApp(res, type);
        },
        (err: any) => {
          this.onErrorr(err);
        }
      );
    }
  }
  addrow(createForm: any) {
    this.dialog.open(createForm, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 120px)',
      disableClose: true,
    });
    // const newItems = [this.createNewRowData()];
    // this.gridApi.updateRowData({
    //   add: newItems,
    //   addIndex: 0,
    // });
    // this.typeofRow = 'add';
    // this.onBtStartEditing();
    // this.showUpdateBtn = true;
  }
  addNewRow() {
    const newItems = [this.createNewRowData()];
    console.log(newItems);
    this.gridApi.updateRowData({
      add: newItems,
      addIndex: 0,
    });
    this.typeofRow = 'add';
    this.onBtStartEditing();
    this.showUpdateBtn = true;
  }
  createNewRowData() {
    const newData: any = {};
    for (let i = 0; i < this.retrColNames.length; i++) {
      newData[this.retrColNames[i]] = '';
    }
    return newData;
  }

  onBtStartEditing() {
    this.gridApi.startEditingCell({
      rowIndex: 0,
      colKey: this.retrColNames[0],
    });
  }
  cancel() {
    this.spinner.hide();
    //this.common.http.cancelCall();
  }
  onSuccessRunApp(data: any, type: any): void {
    if (data.res_status === true) {
      this.connector = '';
      this.tableName = '';
      this.pkey = '';
      this.connector = data.data.connector_name;
      this.tableName = data.data.tbl_name;
      const screenData = data.data.screens_data;
      this.screenData = data.data.screens_data;
      this.actionBtns = [];
      if (
        data.data.action !== undefined &&
        data.data.action !== null &&
        data.data.action.length !== 0
      ) {
        this.actionBtns = data.data.action;
      }
      screenData.map((item: any) => {
        if (item.screen_name.toLowerCase() === 'delete') {
          this.pkey = item.screen_data.fields[0].name;
          this.dynamicUrl = item.screen_data.buttons[0].url;
          //this.updateId = item.screen_data.fields[0].name;
        }
        if (item.screen_name.toLowerCase() === 'edit') {
          this.inputFields = item.screen_data.fields;
        }
        if (item.screen_name.toLowerCase() === 'view') {
          this.viewFields = item.screen_data.fields;
        }
        if (item.screen_name.toLowerCase() === 'create') {
          this.createFields = item.screen_data.fields;
        }
      });

      this.createFields.map((item: any) => {
        if (item.values !== undefined) {
          if (item.values.length > 0) {
            Object.assign(item, { values: item.values, value: '' });
          } else {
            Object.assign(item, { value: '', values: [] });
          }
        } else {
          Object.assign(item, { value: '', values: [] });
        }
      });
      if (type === 'info') {
      } else {
        this.getTableGridData();
      }
    }
  }
  searchByFilter() {
    this.filterString = this.searchfilterString;
    this.getTableGridData();
  }
  getTableGridData(): void {
    this.spinner.show();
    const body = {
      tbl_name: this.tableName,
      connector_name: this.connector,
      op_type: 'retrieve',
      url: this.dynamicUrl,
    };

    if (
      this.filterString !== undefined &&
      this.filterString !== null &&
      this.filterString !== ''
    ) {
      //this.showAddrow = false;
      Object.assign(body, { filter_string: this.filterString });
    } else {
      this.showAddrow = true;
    }
    this.ss.getGridAppData(body).subscribe(
      (res: any) => {
        this.onSuccessGridData(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  getContextMenuItems = (params: any): void | any => {
    // let autoTaskObj;
    // if (this.sessionAppName.toLowerCase() === 'helpdesk') {

    //   autoTaskObj = {
    //     name: 'Create Autotask',
    //     action: () => this.createAutoTask(params.node),
    //     cssClasses: ['pointer'],
    //     icon: '<i class="fa fa-headset"></i>'
    //   };
    // }
    if (params.node.data !== undefined) {
      const result: any[] = [
        {
          name: 'Delete',
          action: () => this.deleteRecord(params.node),
          cssClasses: ['pointer'],
          icon: '<i class="fa fa-trash-alt danger" />',
        },
        {
          name: 'Edit',
          action: () => this.editRecord(params.node),
          cssClasses: ['pointer'],
          icon: '<i class="fa fa-edit pointer" />',
        },
        'copy',
        'copyWithHeaders',
        'paste',
        'separator',
        'export',
      ];
      if (
        this.actionBtns !== undefined &&
        this.actionBtns !== null &&
        this.actionBtns.length !== 0
      ) {
        // if (this.permissions.toLowerCase() === 'all') {

        this.actionBtns.map((test: any) => {
          result.splice(2, 0, {
            name: test.name,
            action: () => this.createAutoTask(params.node, test.url),
            cssClasses: ['pointer'],
            icon: '<i class="fa fa-tasks pointer"></i>',
          });
        });
        //}
      } else {
      }

      return result;
    } else {
      if (this.pkey.length === 0) {
        this.snack.open('Table does not have primary key to update', 'Ok');
      } else {
        const result = [
          {
            name: 'Edit' + ' ',
            action: () => this.showModal(params),
            cssClasses: ['pointer'],
            icon: '<i class="fa fa-pen-fancy primary" />',
          },
        ];
        return result;
      }
    }
  };

  MinimizeDiv(type: any) {
    if (type === 'header') {
      this.minimizeHeader = this.minimizeHeader === true ? false : true;
    }
    if (type === 'gridheader') {
      this.gridHeadCol =
        this.gridHeadCol === '1' ? (this.gridHeadCol = '12') : '1';
      this.minimizeGridHeader = this.minimizeGridHeader === true ? false : true;
    }
    if (type === 'grid') {
      this.minimizeGrid = this.minimizeGrid === true ? false : true;
    }
  }

  onSelectionChanged(params: any) {
    this.selectedNodes = this.gridApi.getSelectedNodes();
  }

  createAutoTask(params: any, url: any) {
    this.spinner.show();
    let body = {};
    const selectedData: any[] = [];
    if (this.selectedNodes.length > 0) {
      this.selectedNodes.map((item) => {
        selectedData.push(item.data);
      });
      Object.assign(body, { data: selectedData });
    } else {
      body = { data: params.data };
    }

    this.ss.createAutoTask(body, url).subscribe(
      (res: any) => {
        this.onsuccessCreateTicket(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }

  onsuccessCreateTicket(resp: any) {
    this.spinner.hide();
    if (resp.res_status === true) {
      this.getTableGridData();
      this.snack.open(resp.msg, 'ok');
    } else {
      this.snack.open(resp.msg, 'ok');
    }
  }
  openEditForm(editForm: any) {
    this.dialog.open(editForm, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 120px)',
      disableClose: true,
    });
  }
  deleteRecord(params: any) {
    Swal.fire({
      title: 'Are you sure want to remove?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.primaryId = params.data[this.pkey];

        this.saveFormData('delete');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your record is safe :)', 'error');
      }
    });
  }
  editDbleRecord(params: any): any {
    this.primaryId = params.data[this.pkey];
    const updatebutton: any = document.getElementById('editform');
    updatebutton.click();
    const dyncolumns = params.data;
    this.finalFields = [];
    const fieldKeys = Object.keys(dyncolumns);
    let dynamicColumns: any = {};
    dynamicColumns = dyncolumns;

    this.inputFields.map((item: any) => {
      if (fieldKeys.includes(item.name) === true) {
        if (item.values !== undefined) {
          if (item.values.length > 0) {
            Object.assign(item, {
              values: item.values,
              value: dynamicColumns[item.name],
            });
          } else {
            debugger;
            Object.assign(item, {
              value: dynamicColumns[item.name],
              values: [],
            });
          }
        } else {
          debugger;
          Object.assign(item, { value: dynamicColumns[item.name], values: [] });
        }

        this.finalFields.push(item);
      } else {
      }
    });
  }
  editRecord(params: any): any {
    this.primaryId = params.data[this.pkey];

    const updatebutton: any = document.getElementById('editform');
    updatebutton.click();
    this.buildDynamicCols(params.data);
  }
  DeleteRecord(params: any): void {
    const body = {
      key_name: [this.pkey],
      data: params.data,
      tbl_name: this.tableName,
      connector_name: this.connector,
      op_type: 'delete',
      url: this.dynamicUrl,
    };

    // const headers = { headers: this.header };
    // const success = this.onSuccessUpdateMultiple.bind(this);
    // const error = this.onErrorr.bind(this);
    // this.common.http.post('app_viz_ops', body, success, error, headers);
    this.ss.getGridAppData(body).subscribe(
      (res: any) => {
        this.onSuccessUpdateMultiple(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }

  onRowChanged(params: any): void {
    if (this.typeofRow === 'add') {
      this.totalNewRowsData = [];
      this.totalNewRowsData.push(params.data);
    } else {
      this.primaryId = params.data[this.pkey];
      const test = {};
      this.inputFields.map((item) => {
        Object.assign(test, {
          [item.name]: params.data[item.name],
          [this.pkey]: this.primaryId,
        });
      });
      this.totalNewRowsData = test;
    }
    //this.updateRowData('update');
  }

  submitSingleData(): void {
    if (
      this.imageArray.length > 0 &&
      this.imageArray.length !== 0 &&
      this.imageArray !== undefined
    ) {
      this.finalFields.push(this.imageArray[0]);
    } else {
    }
    const finalFields = this.finalFields.reduce(
      (obj, item) => Object.assign(obj, { [item.name]: item.value }),
      {}
    );
    this.totalNewRowsData = finalFields;
    this.updateRowData('');
  }
  saveFormData(type: any): void {
    let body = {};
    if (type === 'update') {
      const finalFields = this.inputFields.reduce(
        (obj, item) => Object.assign(obj, { [item.name]: item.value }),
        {}
      );
      Object.assign(finalFields, { [this.pkey]: this.primaryId });
      const reqBodyFields = finalFields;
      this.inputFields.map((item) => {
        if (item.edit === undefined || item.edit === null || item.edit === '') {
          delete reqBodyFields[item.name];
        }
      });
      body = {
        key_name: [this.pkey],
        data: reqBodyFields,
        tbl_name: this.tableName,
        connector_name: this.connector,
        op_type: type,
        url: this.dynamicUrl,
      };
    } else if (type === 'delete') {
      body = {
        key_name: [this.pkey],
        data: { [this.pkey]: this.primaryId },
        tbl_name: this.tableName,
        connector_name: this.connector,
        op_type: type,
        url: this.dynamicUrl,
      };
    } else {
      const finalFields = this.createFields.reduce(
        (obj: any, item: any) =>
          Object.assign(obj, { [item.name]: item.value }),
        {}
      );

      this.createFields.forEach((element: any, index: any) => {
        if (
          element.value === undefined ||
          element.value === null ||
          element.value === ''
        )
          delete finalFields[element.name];
      });

      body = {
        data: finalFields,
        tbl_name: this.tableName,
        connector_name: this.connector,
        op_type: type,
        url: this.dynamicUrl,
      };
    }

    this.ss.getGridAppData(body).subscribe(
      (res: any) => {
        this.onSuccessUpdateSingle(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onRowEditingStarted(event: RowEditingStartedEvent | any) {
    console.log('never called - not doing row editing');
  }

  onRowEditingStopped(event: RowEditingStoppedEvent | any) {
    console.log('never called - not doing row editing');
  }

  onCellEditingStarted(event: CellEditingStartedEvent | any) {
    console.log('cellEditingStarted');
  }

  onCellEditingStopped(params: CellEditingStoppedEvent | any) {
    if (this.typeofRow === 'edit') {
      this.primaryId = params.data[this.pkey];
      const test = {};
      this.inputFields.map((item) => {
        Object.assign(test, {
          [item.name]: params.data[item.name],
          [this.pkey]: this.primaryId,
        });
      });
      this.totalNewRowsData = test;
      this.updateRowData('');
    }
  }
  updateRow() {
    if (this.typeofRow === 'add') {
      this.updateRowData('');
    } else {
      this.typeofRow = 'edit';
      this.updateRowData('');
      //this.gridApi.stopEditing();
    }
  }
  updateRowData(type: any): void {
    debugger;
    //this.gridApi.stopEditing();
    this.spinner.show();
    let body = {};
    if (this.typeofRow === 'add') {
      this.totalNewRowsData = this.totalNewRowsData.filter(
        (el: any, i: any, a: any) => i === a.indexOf(el)
      );
      this.totalNewRowsData.map((item: any) => {
        delete item['[object Object]'];
      });

      body = {
        data: this.totalNewRowsData,
        tbl_name: this.tableName,
        connector_name: this.connector,
        op_type: 'insert',
        url: this.dynamicUrl,
      };
    } else {
      const tempTotalNewRowsData = this.totalNewRowsData;
      this.inputFields.map((item) => {
        if (item.edit === undefined || item.edit === null || item.edit === '') {
          delete tempTotalNewRowsData[item.name];
        }
      });
      body = {
        key_name: [this.pkey],
        data: tempTotalNewRowsData,
        tbl_name: this.tableName,
        connector_name: this.connector,
        op_type: 'update',
        url: this.dynamicUrl,
      };
    }
    this.ss.getGridAppData(body).subscribe(
      (res: any) => {
        this.onSuccessUpdateSingle(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUpdateSingle(data: any): void {
    this.spinner.hide();
    this.dialog.closeAll();
    this.typeofRow = '';
    if (data.res_status === true) {
      this.snack.open(data.msg, 'Ok');
      this.getTableGridData();
      this.createFields.map((item: any) => {
        item.value = '';
      });
    } else {
      this.snack.open(data.msg, 'Ok');
    }
  }
  hideModal(): void {
    this.dialog.closeAll();
  }
  openModal(openAddData: any): void {
    this.dialog.open(openAddData, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 120px)',
      disableClose: true,
    });
  }
  showModal(params: any): void {
    if (params.column.colDef.headerName.includes(this.pkey) === true) {
      this.snack.open('Cannot edit Primary Key', 'Ok');
    } else {
      const modalbutton: any = document.getElementById('modalID');
      modalbutton.click();
      this.ObjKeys = [];
      this.arrjson = [];
      this.columnName = params.column.colDef.headerName;
      this.OldValue = params.value;
      this.screenData.map((item: any) => {
        if (item.screen_name.toLowerCase() === 'edit') {
          item.screen_data.fields.map((test: any) => {
            if (test.name === this.columnName) {
              this.DBList = test.values;
              this.filteredDbOptions = this.NewValue.valueChanges.pipe(
                startWith(''),
                map((value) =>
                  typeof value === 'string' ? value : value.domain
                ),
                map((name) =>
                  name ? this.domainFilter(name) : this.dbListDetails.slice()
                )
              );
            } else {
            }
          });
        }
      });

      this.NewValue.setValue('');
      this.isModalShown = true;
      this.gridGroupEditEvents = params.node.allLeafChildren;
      this.gridGroupEditEvents.map((item) => {
        const d = item.data;
        this.arrjson.push(d);
      });
      this.recordLength = this.arrjson.length;
      let header: any[] = [];
      this.arrjson.map((item) => {
        header = Object.keys(item);
      });
      header.map((item: any) => {
        this.displayedColumns.push({ headerName: item, field: item });
      });
      this.dataSource = new MatTableDataSource<any>(this.arrjson);
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  }
  filterDatatable(event: any): void {
    const value = event.target.value;
    this.gridApi.setQuickFilter(value);
  }
  UpdateDatagridMultiple(): void {
    this.spinner.show();

    this.arrjson.map((item) => {
      item[this.columnName] = this.NewValue.value;
    });
    const body = {
      data: this.arrjson,
      tbl_name: this.tableName,
      key_name: [this.pkey],
      connector_name: this.connector,
      op_type: 'update',
      url: this.dynamicUrl,
      token: this.gs.getUserToken(),
    };

    this.ss.getGridAppData(body).subscribe(
      (res: any) => {
        this.onSuccessUpdateMultiple(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUpdateMultiple(data: any): void {
    this.spinner.hide();
    if (data.res_status === true) {
      this.snack.open(data.msg, 'Ok');
      this.getTableGridData();
      this.hideModal();
    } else {
      this.snack.open(data.msg, 'Ok');
    }
  }
  onSuccessGridData(data: any): void {
    if (data.res_status === true) {
      this.spinner.hide();
      this.showGrid = true;
      this.rowData = [];
      this.columns = [];
      this.columnDefs = [];
      this.rowData = data.data;
      let header = [];
      this.rowData.map((item) => {
        header = Object.keys(item);
      });
      this.showUpdateBtn = false;

      this.viewFields.map((test: any) => {
        this.columns.push({
          headerName: test.name,
          field: test.name,
          cellRenderer: this.getDataType,
        });
      });

      if (
        this.actionBtns !== undefined &&
        this.actionBtns !== null &&
        this.actionBtns.length !== 0
      ) {
        //if (this.permissions.toLowerCase() === 'all'){
        const checkboxObj = {
          headerName: '',
          field: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          width: 50,
          rowGroup: false,
          pivot: false,
        };
        this.columns.splice(0, 0, checkboxObj);
        //}
      }
      // header.map((item) => {
      //   this.columns.push({ headerName: item, field: item, editable: true,  cellRenderer: this.getDataType });
      // });
      this.columns.map((item) => {
        if (item.headerName === this.pkey) {
          //item.editable = false;
          item.headerName = item.headerName + ' (primary key)';
        }
      });

      this.screenData.map((item: any) => {
        if (item.screen_name.toLowerCase() === 'edit') {
          item.screen_data.fields.map((test: any) => {
            this.columns.map((subItem) => {
              if (subItem.headerName === test.name) {
                if (
                  test.values !== undefined &&
                  test.values !== null &&
                  test.values.length > 0
                ) {
                  subItem.cellEditor = 'agRichSelectCellEditor';
                  subItem.cellEditorParams = { values: test.values };
                  if (test.edit !== undefined && test.edit !== null) {
                    subItem.editable = test.edit;
                  }
                } else {
                  if (test.edit !== undefined && test.edit !== null) {
                    subItem.editable = test.edit;
                  }
                }
              }
            });
          });
        }
      });
      this.columnDefs = this.columns;
      this.retrColNames = this.columns;
      if (this.columns.length < 10) {
        setTimeout(() => {
          this.gridApi.sizeColumnsToFit();
        }, 1000);
      }

      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        resizable: true,
        filter: true,
      };

      this.sidebar = true;
      this.editType = 'fullRow';
      this.sortingOrder = ['desc', 'asc', null];
      this.rowGroupPanelShow = 'always';
      this.pivotPanelShow = 'open';
      this.pivotColumnGroupTotals = 'after';
      this.pivotRowTotals = 'before';
    } else {
      this.rowData = [];
      this.columns = [];
      this.columnDefs = [];
      this.viewFields.map((test: any) => {
        this.columns.push({
          headerName: test.name,
          field: test.name,
          cellRenderer: this.getDataType,
        });
      });
      if (
        this.actionBtns !== undefined &&
        this.actionBtns !== null &&
        this.actionBtns.length !== 0
      ) {
        // if (this.permissions.toLowerCase() === 'all') {
        const checkboxObj = {
          headerName: '',
          field: '',
          checkboxSelection: true,
          headerCheckboxSelection: true,
          width: 50,
          rowGroup: false,
          pivot: false,
        };
        this.columns.splice(0, 0, checkboxObj);
        // }
      }
      this.columns.map((item) => {
        if (item.headerName === this.pkey) {
          item.headerName = item.headerName + ' (primary key)';
        }
      });

      this.screenData.map((item: any) => {
        if (item.screen_name.toLowerCase() === 'create') {
          item.screen_data.fields.map((test: any) => {
            this.columns.map((subItem) => {
              if (subItem.headerName === test.name) {
                if (
                  test.values !== undefined &&
                  test.values !== null &&
                  test.values.length > 0
                ) {
                  subItem.cellEditor = 'agRichSelectCellEditor';
                  subItem.cellEditorParams = { values: test.values };
                  if (test.create !== undefined && test.create !== null) {
                    subItem.editable = test.create;
                  }
                } else {
                  if (test.create !== undefined && test.create !== null) {
                    subItem.editable = test.create;
                  }
                }
              }
            });
          });
        }
      });
      this.columnDefs = this.columns;
      this.retrColNames = this.columns;
      this.showGrid = true;
      this.spinner.hide();
      this.snack.open(data.msg, 'Ok', { duration: 1000 });
    }
  }
  onHidden(): void {
    this.isModalShown = false;
  }
  enableUpdateBtn(): void {
    //this.typeofRow = 'edit';
    this.showUpdateBtn = true;
  }
  getDataType(params: any) {
    if (params.value !== undefined && params.value !== null) {
      return params.value;
    } else {
      return '';
    }
  }
  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.closeToolPanel();
    this.openOrderGridOptions.columnApi!.moveColumns([this.pkey], 0);
    // this.gridColumnApi.applyColumnState({
    //   state: [
    //     { colId: this.pkey },
    //   ],
    //   applyOrder: true,
    // });
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: error.msg,
    });
  }
  onFileInput(fileList: any): void {
    const file = fileList[0];
    this.uploadForm.get('profile').setValue(file);
    //this.onUpload();
    this.fileInput.nativeElement.value = '';
  }
  onUpload(): void {
    // Object.assign(formData, {formdata: 'formvalue'});
    // this.spinner.show();
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);
  }
  readURL(event: Event | any): void {
    if (event && event[0]) {
      const file = event[0];
      const reader = new FileReader();
      reader.onload = (e) => (this.imageArray[0].value = reader.result);
      reader.readAsDataURL(file);
    }
    setTimeout(() => {
      this.imageArray.map((item) => {
        item.value = item.value.split(',')[1];
      });
    }, 1000);
  }
  setDefaultPic(evt: any) {
    evt.target.src = this.imgurl + 'noimage.jpg';
  }
  buildDynamicCols(dyncolumns: any): void {
    console.log(dyncolumns);
    this.finalFields = [];
    const fieldKeys = Object.keys(dyncolumns);
    let dynamicColumns: any = {};
    dynamicColumns = dyncolumns;

    this.inputFields.map((item) => {
      if (fieldKeys.includes(item.name) === true) {
        if (item.values !== undefined) {
          if (item.values.length > 0) {
            Object.assign(item, {
              values: item.values,
              value: dynamicColumns[item.name],
            });
          } else {
            Object.assign(item, {
              value: dynamicColumns[item.name],
              values: [],
            });
          }
        } else {
          Object.assign(item, { value: dynamicColumns[item.name], values: [] });
        }
        // if (item.values.length > 1) {
        //   Object.assign(item, {values: item.values, value: dynamicColumns[item.name]});
        // }else {
        //   Object.assign(item, {value: dynamicColumns[item.name], values: []});
        // }
        // if (item.type === 'date') {
        //  Object.assign(item, {value: this.rowData[0][item.name].split(' ')[0], values: []});
        // }
        this.finalFields.push(item);
      } else {
      }
    });
    console.log(this.inputFields);
    const firstValues = this.finalFields;
    const secValues = fieldKeys;
    const array3 = secValues.filter(
      (entry1) => !firstValues.some((entry2) => entry1 === entry2.name)
    );
    array3.map((item) => {
      this.finalFields.push({
        name: item,
        value: dynamicColumns[item],
        type: 'text',
        values: [],
      });
    });
    this.finalFields.unshift(
      this.finalFields.splice(
        this.finalFields.findIndex((item) => item.name === this.pkey),
        1
      )[0]
    );
    this.imageArray = [];
    this.finalFields.map((item, i) => {
      if (item.type === 'image') {
        this.imageArray = [item];
        this.finalFields.splice(i, 1);
      }
    });
  }
}
