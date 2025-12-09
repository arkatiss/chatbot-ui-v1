import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
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
  selector: 'app-viewmaping',
  templateUrl: './viewmaping.component.html',
  styleUrls: ['./viewmaping.component.scss'],
})
export class ViewmapingComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private ss: SecurityService,
    private error: ErrorService
  ) {}

  userNames: any[] = [];
  domainDetails: any[] = [];
  subDomainDetails: any[] = [];
  domain: any;
  subDomain: any;
  userName: any;
  mapId: any;
  displayedColumns: any[] = [];
  rowData: any[] = [];
  filteredData: any[] = [];
  userNameControl = new FormControl();
  filteredOptions: Observable<User[]> | any;
  domainNameControl = new FormControl();
  filteredDomainOptions: Observable<User[]> | any;
  subDomainNameControl = new FormControl();
  filteredSuDomainOptions: Observable<User[]> | any;

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
    this.getMaping();
    this.ss.getAllUserData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.userNames = info;
      }
    });
    this.ss.getDomainData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.domainDetails = info;
      }
    });
    this.filteredOptions = this.userNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.userNames.slice()))
    );
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
  }
  getMaping(): any {
    this.spinner.show();
    const body = { map_type: 'retrieve' };
    this.ss.maping(body).subscribe(
      (res: any) => {
        this.onSuccessMaping(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessMaping(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.rowData = data.data;
      this.filteredData = this.rowData;

      this.rowData.map((item, i) => {
        Object.assign(item, { sno: i + 1 });
      });
      this.filteredData = this.rowData;
      this.columns = [];
      this.columns = [
        { headerName: 'S.No', field: 'sno' },
        { headerName: 'User Name', field: 'user_name' },
        { headerName: 'Domain', field: 'domain' },
        { headerName: 'Sub Domain', field: 'sub_domain' },
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

      this.displayedColumns = [
        { name: 'User Name', prop: 'user_name' },
        { name: 'Domain', prop: 'domain' },
        { name: 'Sub Domain', prop: 'sub_domain' },
        { name: 'Created By', prop: 'created_by' },
      ];
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  cellClicked(params: any, openAddData: any): void {
    if (params.colDef.field === 'delete') {
      this.deleteMapData(params.data.map_id);
    } else if (params.colDef.field === 'edit') {
      this.editMapData(openAddData, params.data);
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

  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  selectDomainForMaping(val: any): any {
    this.subDomainNameControl.setValue('');
    this.domainDetails.forEach((element) => {
      if (element.domain === val) {
        this.subDomainDetails = element.sub_domain;
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
  }
  editMapData(openAddData: any, row: any): any {
    this.userNameControl.patchValue(row.user_name);
    this.domainNameControl.patchValue(row.domain);
    this.subDomainNameControl.patchValue(row.sub_domain);
    this.userName = row.user_name;
    this.domain = row.domain;
    // this.selectDomainForMaping(this.domain);
    this.subDomain = row.sub_domain;
    this.mapId = row.map_id;
    this.dialog.open(openAddData, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 60px)',
    });
  }

  updateMaping(): any {
    const body = {
      map_type: 'update',
      json_data: {
        user_name: this.userNameControl.value,
        domain: this.domainNameControl.value,
        sub_domain: this.subDomainNameControl.value,
        map_id: this.mapId,
      },
    };
    this.ss.maping(body).subscribe(
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
      this.userNameControl.patchValue('');
      this.domainNameControl.patchValue('');
      this.subDomainNameControl.patchValue('');
      this.getMaping();
      Swal.fire({
        icon: 'success',
        text: data.msg,
      });
      this.dialog.closeAll();
    } else {
      Swal.fire({
        icon: 'success',
        text: this.error.handleError(data),
      });
    }
  }
  deleteMapData(id: any): any {
    Swal.fire({
      title: 'Are you sure want to remove?',
      text: 'You will not be able to recover this file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        const body = { map_type: 'delete', json_data: { map_id: id } };
        this.ss.maping(body).subscribe(
          (res: any) => {
            this.onSuccessDelMapData(res);
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
  onSuccessDelMapData(data: any): any {
    if (data.res_status === true) {
      Swal.fire({
        icon: 'success',
        text: data.msg,
      });
      this.getMaping();
    } else {
      Swal.fire({
        icon: 'success',
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
      option.domain.toLowerCase().includes(filterValue)
    );
  }
  private subdomainFilter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.subDomainDetails.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  filterDatatable(event: any): void {
    const eventValue: any = event.target.value;
    this.gridApi.setQuickFilter(eventValue);
  }

  displayFn(option: any): string {
    if (!option) return '';
    return option.name || option.domain || option;
  }
}
