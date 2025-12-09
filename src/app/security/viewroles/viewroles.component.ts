import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SecurityService } from '../service/security.service';
import { ErrorService } from '../../helper/error.service';
import { GeneralService } from '../../helper/general.service';
// import { AllModules } from '@ag-grid-enterprise/all-modules';
export interface User {
  name: string;
  email: string;
}
@Component({
  selector: 'app-viewroles',
  templateUrl: './viewroles.component.html',
  styleUrls: ['./viewroles.component.scss'],
})
export class ViewrolesComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private gs: GeneralService,
    private ss: SecurityService,
    private error: ErrorService
  ) {}
  roleName: any;

  userNames: any[] = [];
  displayedColumns: any[] = [];
  rowData: any[] = [];
  roleId: any;
  filteredData: any[] = [];
  Roles: any[] = [];
  userRole: any;
  userNameControl = new FormControl();
  userEmail: any;
  username: any;
  filteredOptions: Observable<User[]> | any;

  columns: any[] = [];
  gridApi: any;
  gridColumnApi: any;
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
  ngOnInit(): void {
    this.getRoles();
    this.ss.getAllUserData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.userNames = info;
      }
    });
    this.gs.getUserRoleData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          this.userRole = info;
        } else {
        }
      }
    });
    if (this.userRole === 'global_admin') {
      this.Roles = [
        { name: 'Global Configurator', value: 'global_configurator' },
        { name: 'Domain Admin', value: 'domain_admin' },
        { name: 'Domain Configurator', value: 'domain_configurator' },
        { name: 'End User', value: 'enduser' },
      ];
    } else if (this.userRole === 'global_configurator') {
      this.Roles = [
        { name: 'Domain Admin', value: 'domain_admin' },
        { name: 'Domain Configurator', value: 'domain_configurator' },
        { name: 'End User', value: 'enduser' },
      ];
    } else if (this.userRole === 'domain_admin') {
      this.Roles = [
        { name: 'Domain Configurator', value: 'domain_configurator' },
        { name: 'End User', value: 'enduser' },
      ];
    } else if (this.userRole === 'domain_configurator') {
      this.Roles = [{ name: 'End User', value: 'enduser' }];
    }

    this.filteredOptions = this.userNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.userNames.slice()))
    );
  }
  getRoles(): any {
    this.spinner.show();
    const body = { user_roles_type: 'retrieve' };
    this.ss.roles(body).subscribe(
      (res: any) => {
        this.onSuccessRoles(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessRoles(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      //this.rowData = data.data;
      //this.filteredData = this.rowData;

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
        { headerName: 'Name', field: 'name' },
        { headerName: 'Role', field: 'role' },
        { headerName: 'Created By', field: 'created_by' },
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

      // this.displayedColumns = [ {name: 'Email', prop: 'email'},
      // {name: 'Name', prop: 'name'},
      // {name: 'Role', prop: 'role'},
      // {name: 'Created By', prop: 'created_by'}]
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
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
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  editRoleData(openAddData: any, row: any): any {
    this.userEmail = row.email;
    this.username = row.name;
    this.userNameControl.patchValue(row.name);
    this.roleName = row.role;
    this.roleId = row.id;
    this.dialog.open(openAddData, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 60px)',
    });
  }

  updateRole(): any {
    this.spinner.show();
    const body = {
      user_roles_type: 'update',
      json_data: {
        name: this.username,
        email: this.userEmail,
        role: this.roleName,
        id: this.roleId,
      },
    };
    this.ss.roles(body).subscribe(
      (res: any) => {
        this.onSuccessUpdateRole(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUpdateRole(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      Swal.fire({
        icon: 'success',
        text: data.msg,
      });

      this.getRoles();
      this.dialog.closeAll();
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  deleteRoleData(id: any): any {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        const body = { user_roles_type: 'delete', json_data: { id: id } };

        this.ss.roles(body).subscribe(
          (res: any) => {
            this.onSuccessDelRole(res);
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
  onSuccessDelRole(data: any): any {
    if (data.res_status === true) {
      Swal.fire({
        icon: 'success',
        text: data.msg,
      });
      this.getRoles();
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
  updateMySelection(data: any): any {
    this.userEmail = data.email;
    this.username = data.name;
  }
  cellClicked(params: any, openAddData: any): void {
    if (params.colDef.field === 'delete') {
      this.deleteRoleData(params.data.id);
    } else if (params.colDef.field === 'edit') {
      this.editRoleData(openAddData, params.data);
    }
  }
  editCellRenderer(params: any): any {
    if (params.colDef.field === 'delete') {
      return `<i class="far fa-trash-alt bot-warn font-18 pointer"></i>`;
    } else if (params.colDef.field === 'edit') {
      return `<i class="fa fa-edit bot-warn font-18 pointer" (click)='selClc()'></i>`;
    }
  }
  displayFn(option: any): string {
    return option?.name || '';
  }
}
