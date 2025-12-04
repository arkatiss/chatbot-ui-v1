import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ConfigService } from '../service/config.service';
import { CommonService } from '../../helper/common.service';
import { ErrorService } from '../../helper/error.service';
// import { AllModules } from '@ag-grid-enterprise/all-modules';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-domainview',
  templateUrl: './domainview.component.html',
  styleUrls: ['./domainview.component.scss'],
})
export class DomainviewComponent implements OnInit {
  filteredData: any[] = [];
  rowData: any[] = [];
  displayedColumns: any[] = [];
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
  autoGroupColumnDef!: { width: number };
  rowGroupPanelShow: any;
  pivotPanelShow: any;
  pivotColumnGroupTotals: any;
  pivotRowTotals: any;
  constructor(
    private common: CommonService,
    private spinner: NgxSpinnerService,
    private cs: ConfigService,
    private error: ErrorService
  ) {}

  ngOnInit(): void {
    this.retrieveDomain();
  }
  retrieveDomain(): any {
    this.spinner.show();
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
    this.spinner.hide();
    if (datas.res_status === true) {
      const rowData = datas.data;
      rowData.map((item: any, i: any) => {
        Object.assign(item, { sno: i + 1 });
      });
      this.rowData = rowData;
      this.filteredData = this.rowData;
      this.columns = [];
      this.columns = [
        { headerName: 'S.No', field: 'sno' },
        { headerName: 'Domain', field: 'domain' },
        { headerName: 'Sub Domain', field: 'sub_domain' },
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
        { name: 'Domain', prop: 'domain' },
        { name: 'Sub Domain', prop: 'sub_domain' },
      ];
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(datas),
      });
    }
  }
  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.closeToolPanel();
  }
  filterDatatable(data: any) {
    const event: any = data.target.value;
    this.gridApi.setQuickFilter(event);
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  cancel(): any {
    this.spinner.hide();
    this.common.http.cancelCall();
  }
}
