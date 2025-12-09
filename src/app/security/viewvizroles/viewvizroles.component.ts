// import { AllModules } from '@ag-grid-enterprise/all-modules';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { User } from '../maping/maping.component';
import { SecurityService } from '../service/security.service';
import { ErrorService } from '../../helper/error.service';

@Component({
  selector: 'app-viewvizroles',
  templateUrl: './viewvizroles.component.html',
  styleUrls: ['./viewvizroles.component.scss'],
})
export class ViewvizrolesComponent implements OnInit {
  constructor(
    private ss: SecurityService,
    private dialog: MatDialog,
    public spinner: NgxSpinnerService,

    private snack: MatSnackBar,
    private error: ErrorService
  ) {}
  rowData: any[] = [];
  filteredData: any[] = [];
  displayedColumns: any[] = [];
  appsControl = new FormControl();
  permissionControl = new FormControl();
  filteredOptions: Observable<User[]> | any;
  userNames: any[] = [];
  appList: string[] = [];
  appListView: string[] = ['All', 'View'];
  selectedApps = this.appList;
  selectedAppsView = this.appListView;
  allSelected = false;
  allSelectedViews = false;
  selectall = 'Select All';
  selectallViews = 'Select All';
  @ViewChild('select') select: MatSelect | any;
  @ViewChild('selectview') selectView: MatSelect | any;
  email: any;
  columns: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  modules: any;
  // modules = AllModules;
  columnDefs: any[] = [];
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
  userNameControl = new FormControl();
  showupdatebtn = false;
  ngOnInit(): void {
    this.getRoles();
    this.getAppNames();
    this.ss.getAllUserData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.userNames = info;
      }
    });
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.userNames.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  getRoles(): any {
    const body = { app_viz_type: 'retrieve' };
    this.ss.vizroles(body).subscribe(
      (res: any) => {
        this.onSuccessRoles(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessRoles(data: any): any {
    if (data.res_status === true) {
      this.rowData = data.data;
      this.filteredData = this.rowData;
      const rowData = data.data;
      rowData.map((item: any, i: any) => {
        Object.assign(item, { sno: i + 1 });
      });
      this.rowData = rowData;
      this.filteredData = this.rowData;
      this.columns = [];
      this.columns = [
        { headerName: 'S.No', field: 'sno' },
        { headerName: 'Email', field: 'email' },
        { headerName: 'Apps', field: 'appname' },
        { headerName: 'Permissions', field: 'permissions' },
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
      this.columnDefs = this.columns;
      setTimeout(() => {
        this.gridApi.sizeColumnsToFit();
      }, 1000);
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
      this.displayedColumns = [
        { name: 'Email', prop: 'email' },
        { name: 'Apps', prop: 'appname' },
        { name: 'Permissions', prop: 'permissions' },
      ];
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  addRole(): void {
    this.spinner.show();
    const body = {
      app_viz_type: 'insert',
      email: this.userNameControl.value,
      appname: this.appsControl.value,
      permissions: [this.permissionControl.value],
    };
    this.ss.vizroles(body).subscribe(
      (res: any) => {
        this.onSuccessInsertRoles(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessInsertRoles(data: any): void {
    this.snack.open(data.msg, 'Ok');
    this.spinner.hide();
    if (data.res_status === true) {
      this.getRoles();
      this.userNameControl.setValue('');
      this.appsControl.setValue('');
      this.permissionControl.setValue('');
      this.allSelected = false;
      this.allSelectedViews = false;
    } else {
      this.userNameControl.setValue('');
      this.permissionControl.setValue('');
      this.allSelected = false;
      this.allSelectedViews = false;
      this.error.handleError(data);
    }
  }
  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.closeToolPanel();
  }
  cellClicked(params: any, openAddData: any): void {
    if (params.colDef.field === 'delete') {
      this.deleteRoleData(params.data.email);
    } else if (params.colDef.field === 'edit') {
      this.editRoleData(openAddData, params.data);
    }
  }
  filterDatatable(event: any): void {
    const data: any = event.target.value;
    this.gridApi.setQuickFilter(data);
  }
  onSearchAppList(event: any): void {
    const value: any = event.target.value;
    this.selectedApps = this.searchAppList(value);
  }
  onSearchAppListView(value: any): void {
    this.selectedApps = this.searchAppListView(value);
  }
  searchAppListView(value: string): any {
    const filter = value.toLowerCase();
    return this.appListView.filter((option) =>
      option.toLowerCase().startsWith(filter)
    );
  }
  searchAppList(value: string): any {
    const filter = value.toLowerCase();
    return this.appList.filter((option) =>
      option.toLowerCase().startsWith(filter)
    );
  }
  toggleAllSelection(): void {
    if (this.allSelected) {
      this.selectall = 'Deselect All';
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectall = 'Select All';
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  toggleAllSelectionViews(): void {
    if (this.allSelectedViews) {
      this.selectallViews = 'Deselect All';
      this.selectView.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectallViews = 'Select All';
      this.selectView.options.forEach((item: MatOption) => item.deselect());
    }
  }
  changeApps(): void {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
  changeViews(): void {
    let newStatus = true;
    this.selectView.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedViews = newStatus;
  }
  editRoleData(openAddData: any, row: any): any {
    console.log(row);
    this.showupdatebtn = !this.showupdatebtn;
    this.appsControl.patchValue(row.appname);
    this.permissionControl.patchValue(row.permissions[0]);
    this.email = row.email;
    //this.userNamge = row.
    //this.dialog.open(openAddData, { width: 'max-content', maxHeight: 'calc(100vh - 60px)' });
  }
  updateRole(): void {
    this.spinner.show();
    const body = {
      app_viz_type: 'update',
      email: this.email,
      appname: this.appsControl.value,
      permissions: [this.permissionControl.value],
    };
    this.ss.vizroles(body).subscribe(
      (res: any) => {
        this.onSuccessActionRoles(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessActionRoles(data: any): void {
    this.snack.open(data.msg, 'Ok');
    if (data.res_status === true) {
      this.spinner.hide();
      this.dialog.closeAll();
      this.getRoles();
    } else {
      this.spinner.hide();
      this.cancelSelection();
      this.snack.open(data.msg, 'Ok');
      if (data.res_status === true) {
        this.dialog.closeAll();
        this.getRoles();
      } else {
        this.dialog.closeAll();
        this.getRoles();
      }
    }
  }
  deleteRoleData(emailValue: any): void {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        this.spinner.show();
        const body = { app_viz_type: 'delete', email: emailValue };
        this.ss.vizroles(body).subscribe(
          (res: any) => {
            this.onSuccessActionRoles(res);
          },
          (err: any) => {
            this.onErrorr(err);
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'Your data is safe :)', 'error');
      }
    });
  }
  selectUser(val: any): void {
    this.email = '';
    this.email = val;
  }
  getAppNames(): void {
    this.ss.getAppNames().subscribe(
      (res: any) => {
        this.onSuccessAppNames(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessAppNames(data: any): void {
    if (data.res_status === true) {
      this.appList = data.data;
      this.selectedApps = this.appList;
    }
  }
  editCellRenderer(params: any): any {
    if (params.colDef.field === 'delete') {
      return `<i class="far fa-trash-alt bot-warn font-18 pointer"></i>`;
    } else if (params.colDef.field === 'edit') {
      return `<i class="fa fa-edit bot-warn font-18 pointer" (click)='selClc()'></i>`;
    }
  }
  onErrorr(error: any): any {
    // this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  cancelSelection(): void {
    this.showupdatebtn = !this.showupdatebtn;
    this.userNameControl.setValue('');
    this.appsControl.setValue('');
    this.permissionControl.setValue('');
    this.allSelected = false;
    this.allSelectedViews = false;
  }
}
