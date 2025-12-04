import { Component, OnInit, TemplateRef } from '@angular/core';
import { PagesService } from '../../pages.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false, showError: true },
    },
  ],
})
export class GridComponent implements OnInit {
  constructor(
    private pageservice: PagesService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}
  getContextMenuItems: any;
  footer: any;
  keys: any[] = [];
  values: any[] = [];
  columns: any[] = [];
  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  // modules = AllModules;
  modules: any;
  columnDefs: any;
  showgrid = false;
  vals: any[] = [];
  keyvals: any[] = [];
  invvalues: any[] = [];
  showemptytable = false;
  linktext: any;
  doclink = false;
  defaultColDef: any = {
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
  infoval: any;
  textval: string | any;
  paginationPageSize: any;
  pageSize = 25;
  rowGroupPanelShow: any;
  pivotPanelShow: any;
  pivotColumnGroupTotals: any;
  pivotRowTotals: any;
  aggFuncs: any;
  jsonData: any;
  downloadJson: any;
  inputKeyword: any;
  tableSearch: any;
  isLinear: any;
  finalFields: any[] = [];
  claimPercentage: any;
  claimStatus: any;
  claimType: any;
  status: any;
  modifiedBy: any;
  modifiedOn: any;
  createdBy: any;
  createdOn: any;
  locationCoordinates: any[] = [];
  filterData: any;
  currentLatitude: number | any;
  currentLongitude: number | any;
  WareHouseLocations: any;
  warehouseKey: any;
  checked: boolean = false;
  showLocationToggle: boolean = false;
  entity: any;
  locationFlag: any;
  showTemplate: any;

  ngOnInit(): void {
    this.pageservice.getAggridData().subscribe((info: any) => {
      // this.spinner.show();
      if (info !== undefined && info !== null) {
        if (Object.keys(info).length > 0) {
          if (info.intent !== 'claim_status') {
            console.log(info);
            this.vals = [];
            this.rowData = [];
            this.columns = [];
            this.invvalues = [];
            this.warehouseKey = info?.warehouseKey;
            this.locationCoordinates = info?.locationCoordinates;
            console.log(this.locationCoordinates);
            this.filterData = info.gridData;
            this.rowData = info.rowData;
            this.locationFlag = info.locationFlag;
            this.vals = info.gridData;
            this.entity = info.entity;
            this.tableSearch = '';
            let header: any[] = [];
            this.showTemplate = 'grid';
            this.rowData.map((item) => {
              header = Object.keys(item);
            });

            if (this.entity) {
              if (
                this.warehouseKey === undefined ||
                this.warehouseKey === null
              ) {
                this.checked = true;
                this.showLocationToggle = true;
              } else {
                if (this.locationFlag === 'supported') {
                  this.showLocationToggle = true;
                  this.checked = true;
                } else if (this.locationFlag === 'not supported') {
                  this.showLocationToggle = false;
                  this.checked = false;
                } else {
                  this.showLocationToggle = true;
                  this.checked = false;
                }
              }
            }

            if (header.length > 2) {
              header.map((item) => {
                this.columns.push({ headerName: item, field: item });
              });

              this.columnDefs = this.columns;
              this.defaultColDef = {
                enableRowGroup: true,
                enablePivot: true,
                enableValue: true,
                sortable: true,
                resizable: true,
                filter: true,
              };
              this.sidebar = true;
              this.sortingOrder = ['desc', 'asc', null];
              this.rowGroupPanelShow = 'always';
              this.pivotPanelShow = 'open';
              this.pivotColumnGroupTotals = 'after';
              this.pivotRowTotals = 'before';
              this.autoGroupColumnDef = { width: 150 };
              this.aggFuncs = { distinct: CountDFunc };
            } else {
              this.showTemplate = 'tiles';
              this.columnDefs = header;
              this.vals.map((item: any) => {
                this.invvalues.push({
                  key: Object.keys(item),
                  value: Object.values(item),
                });
              });
            }
            //this.getCurrentLocation();
          } else {
            this.showTemplate = 'stepper';
            const gridData = info.gridData[0];
            this.claimPercentage = gridData.claim_percentage;
            this.claimStatus = gridData.claim_status;
            this.claimType = gridData.claim_type;
            this.status = gridData.status;
            this.modifiedBy = gridData.modified_by;
            this.modifiedOn = gridData.modified_on;
            this.createdBy = gridData.created_by;
            this.createdOn = gridData.created_on;
            delete gridData.claim_percentage,
              delete gridData.claim_status,
              delete gridData.claim_type,
              delete gridData.modified_by,
              delete gridData.modified_on,
              delete gridData.status,
              delete gridData.created_by,
              delete gridData.created_on;
            const keys = Object.keys(gridData);
            this.finalFields = [];
            [gridData].map((item) => {
              keys.map((test) => {
                const obj: any = { name: test, value: item[test] };
                this.finalFields.push(obj);
              });
            });
          }
        }
      }
    });
    this.pageservice.getDiagnosticsData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.jsonData = info;
        this.inputKeyword = this.jsonData.Keyword.Input.input;
        if (this.inputKeyword.includes('@@@') === true) {
          this.inputKeyword = this.inputKeyword.split('@@@')[1];
        } else {
          this.inputKeyword = this.inputKeyword.split('@@@')[0];
        }
      }
    });
  }
  onFilterViz(event: any): void {
    const e: any = event.target.value;
    this.gridApi.setQuickFilter(e);
  }
  openDiagonstics(Diagonstics: TemplateRef<any>): void {
    this.dialog.open(Diagonstics, {
      width: 'max-content',
      maxHeight: 'calc(100vh - 60px)',
    });
  }
  copyClipBoard(): any {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.jsonData.Keyword.url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.snack.open('Link Copied Successfully', 'Ok', { duration: 5000 });
  }
  downloadjson(): void {
    const theJSON = JSON.stringify(this.jsonData);
    const uri = this.sanitizer.bypassSecurityTrustUrl(
      'data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON)
    );
    this.downloadJson = uri;
  }
  close(): void {
    this.dialog.closeAll();
  }
  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.closeToolPanel();
  }
  onChartCreated(event: any): void {}

  onChartRangeSelectionChanged(event: any): void {}

  onChartOptionsChanged(event: any): void {}

  onChartDestroyed(event: any): void {}

  onFirstDataRendered(event: any): void {}

  // getLocation(lat1, lon1, lat2, lon2){
  //   lat1 = +lat1;
  //   lon1 = +lon1;
  //   lat2 = +lat2;
  //   lon2 = +lon2;
  //   const R = 6371;
  //   const dLat = this.degreesToRadians(lat2 - lat1);
  //   const dLon = this.degreesToRadians(lon2 - lon1);
  //   const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  //   const d = R * c;
  //   return d;
  // }

  // degreesToRadians(deg) {
  //   return deg * Math.PI / 180;
  // }
  changeLocation(event: any) {
    if (this.locationCoordinates.length === 0) {
      event.source.checked = false;
      Swal.fire('', 'please allow location access to view report', 'error');
    } else {
      if (event.checked === true) {
        this.checked = true;
        this.rowData = this.filterData.filter(
          (item: any) =>
            item[Object.keys(this.locationCoordinates[0])[1]] ===
            Object.values(this.locationCoordinates[0])[1]
        );
      } else {
        this.checked = false;
        this.rowData = this.filterData;
      }
    }
  }
}
function CountDFunc(params: any): any {
  // return 'xyz';
  const obj = [...new Set(params)];

  return obj.length;
}
