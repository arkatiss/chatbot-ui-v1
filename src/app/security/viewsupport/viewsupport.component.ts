import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ColumnMode } from '@swimlane/ngx-datatable';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SecurityService } from '../service/security.service';
import { ErrorService } from '../../helper/error.service';
// import { AllModules } from '@ag-grid-enterprise/all-modules';
export interface User {
  name: string;
  email: string;
}
@Component({
  selector: 'app-viewsupport',
  templateUrl: './viewsupport.component.html',
  styleUrls: ['./viewsupport.component.scss'],
})
export class ViewsupportComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private ss: SecurityService,
    private error: ErrorService
  ) {}
  supportGroups: any[] = [];
  userNames: any[] = [];
  userName: any;
  domainDetails: any[] = [];
  domain: any;
  supportId: any;
  rowData: any[] = [];
  ColumnMode = ColumnMode;
  temp: any[] = [...this.rowData];
  itemsPerPage = 10;
  itemOptionsPerPage = [5, 10, 20];
  selected: any[] = [];

  filteredData: any[] = [];
  displayedColumns: any[] = [];
  userNameControl = new FormControl();
  filteredOptions: Observable<User[]> | any;
  domainNameControl = new FormControl();
  filteredDomainOptions: Observable<User[]> | any;

  columns: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  // modules = AllModules
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
  subDomainNameControl = new FormControl();
  filteredSubDomainOptions: Observable<any[]> | any;
  subDomainDetails = [];
  domainData = [];
  ngOnInit(): void {
    // this.pageservice.getAllUserData().subscribe(info => {
    //   if (Object.keys(info).length > 0) {
    //     this.userNames = info;
    //   }
    // });

    this.ss.getDomainData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.domainData = info;
        info.map((item: any) => {
          this.domainDetails.push({ name: item.domain });
        });
        this.domainDetails.push({ name: 'General' });
      }
    });

    this.filteredDomainOptions = this.domainNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) =>
        name ? this.domainFilter(name) : this.domainDetails.slice()
      )
    );
    this.filteredSubDomainOptions = this.subDomainNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value)),
      map((name) =>
        name ? this.subDomainFilter(name) : this.subDomainDetails.slice()
      )
    );
    this.getuserNames();
  }
  private subDomainFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.subDomainDetails.filter((option: any) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  displaysubFn(user: any): string {
    return user ? user : '';
  }
  getuserNames(): any {
    this.spinner.show();
    const body = {};
    this.ss.getActiveUsers(body).subscribe(
      (res: any) => {
        this.onSuccessuserNames(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessuserNames(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      const users = data.data;
      this.userNames = [];
      for (const a of users) {
        this.userNames.push({
          email: a.user_name,
          name: a.name,
          status: a.status,
          chatFlag: a.chat_flag,
          chatStatus: a.chat_flag_status,
        });
      }
      this.userNames = this.getUnique(this.userNames, 'email');
      this.filteredOptions = this.userNameControl.valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this._filter(name) : this.userNames.slice()))
      );
      this.getSupportGroups();
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  getUnique(arr: any, comp: any): any {
    const unique = arr
      .map((e: any) => e[comp])
      .map((e: any, i: any, final: any) => final.indexOf(e) === i && i)
      .filter((e: any) => arr[e])
      .map((e: any) => arr[e]);
    return unique;
  }
  getSupportGroups(): any {
    this.spinner.show();
    const body = { support_type: 'retrieve' };
    this.ss.support(body).subscribe(
      (res: any) => {
        this.onSuccessSupport(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessSupport(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.rowData = data.data;
      const rowData = data.data;
      const userNames = this.userNames;
      rowData.map((item: any) => {
        userNames.map((test) => {
          if (item.email === test.email) {
            this.rowData.map((subItem) => {
              if (subItem.email === test.email) {
                subItem.status = test.status;
                subItem.chatFlag = test.chatFlag;
              }
              if (
                subItem.status === undefined &&
                subItem.chatFlag === undefined
              ) {
                subItem.status = 'logged user';
              }
            });
          }
        });
      });
      this.rowData.sort((a, b) => {
        const statusA = a.status;
        const statusB = b.status;
        const chatFlagA = a.chatFlag;
        const chatFlagB = b.chatFlag;
        if (statusA < statusB) {
          return -1;
        }
        if (statusA > statusB) {
          return 1;
        }
        if (chatFlagA > chatFlagB) {
          return 1;
        }
        if (chatFlagA < chatFlagB) {
          return -1;
        }
        return 0;
      });
      this.filteredData = this.rowData;

      this.rowData.map((item, i) => {
        Object.assign(item, { sno: i + 1 });
      });
      this.filteredData = this.rowData;
      this.columns = [];
      this.columns = [
        { headerName: 'S.No', field: 'sno' },
        { headerName: 'Email', field: 'email' },
        { headerName: 'Name', field: 'name' },
        { headerName: 'Domain', field: 'domain' },
        { headerName: 'Sub Domain', field: 'sub_domain' },
        { headerName: 'Created By', field: 'created_by' },
        { headerName: 'Status', field: 'status' },
        {
          headerName: '',
          field: 'edit',
          value: 'edit',
          cellRenderer: this.editCellRenderer,
          sortable: false,
          editable: false,
        },
        {
          headerName: '',
          field: 'delete',
          cellRenderer: this.editCellRenderer,
          sortable: false,
          editable: false,
        },
      ];
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      }, 1000);
      this.columnDefs = this.columns;

      this.defaultColDef = {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        sortable: true,
        resizable: true,
        filter: true,
      };
      this.sidebar = false;
      this.sortingOrder = ['desc', 'asc', null];
      this.rowGroupPanelShow = 'always';
      this.pivotPanelShow = 'open';
      this.pivotColumnGroupTotals = 'after';
      this.pivotRowTotals = 'before';
      this.autoGroupColumnDef = { width: 150 };
      this.supportGroups = data.data;
      // this.displayedColumns = [ {name: 'Email', prop: 'email'},
      // {name: 'Name', prop: 'name'},
      // {name: 'Domain', prop: 'domain'},
      // {name: 'Created By', prop: 'created_by'}, {name: 'Status', prop: 'status'}]
    } else {
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
  cellClicked(params: any, openAddData: any): void {
    if (params.colDef.field === 'delete') {
      this.deleteSupportData(params.data.id);
    } else if (params.colDef.field === 'edit') {
      this.editSupportData(openAddData, params.data);
    }
  }
  editCellRenderer(params: any): any {
    if (params.colDef.field === 'delete') {
      return `<i class="far fa-trash-alt bot-warn font-18 pointer"></i>`;
    } else if (params.colDef.field === 'edit') {
      return `<i class="fa fa-edit bot-warn font-18 pointer" (click)='selClc()'></i>`;
    }
  }
  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.closeToolPanel();
  }
  filterDatatable(event: any): void {
    const value: any = event.target.value;
    this.gridApi.setQuickFilter(value);
  }

  editSupportData(openAddData: any, row: any): void {
    this.userName = row.email;
    this.domain = row.domain;
    this.supportId = row.id;
    this.userNameControl.patchValue(row.name);
    this.domainNameControl.patchValue(row.domain);
    this.onDomainSelectionChange({ option: { value: row.domain } });
    this.subDomainNameControl.patchValue(row.sub_domain);
    this.dialog.open(openAddData, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 60px)',
    });
  }

  UpdateSupport(): any {
    const body = {
      support_type: 'update',
      json_data: {
        name: this.userNameControl.value,
        email: this.userName,
        domain: this.domain,
        sub_domain: this.subDomainNameControl.value,
        id: this.supportId,
      },
    };

    this.ss.support(body).subscribe(
      (res: any) => {
        this.onSuccessUpdate(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUpdate(data: any): any {
    if (data.res_status === true) {
      this.getSupportGroups();
      Swal.fire({
        icon: 'success',
        text: data.msg,
      });
      this.dialog.closeAll();
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  deleteSupportData(Id: any): any {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        const body = { support_type: 'delete', json_data: { id: Id } };
        this.ss.support(body).subscribe(
          (res: any) => {
            this.onSuccessDelSupport(res);
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
  onSuccessDelSupport(data: any): any {
    if (data.res_status === true) {
      Swal.fire({
        icon: 'success',
        text: data.msg,
      });
      this.getSupportGroups();
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.userNames.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private domainFilter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.domainDetails.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  updateMySelection(data: any): any {
    this.userName = data.email;
  }
  updateDomain(data: any): any {
    this.domain = data.name;
  }
  onDomainSelectionChange(event: any): any {
    let subDomainData: any = this.domainData.find(
      (item: any) => item.domain === event.option.value
    );
    this.subDomainDetails = subDomainData ? subDomainData.sub_domain : [];
    this.subDomainNameControl.reset();
  }
}
