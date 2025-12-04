import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AllModules } from '@ag-grid-enterprise/all-modules';
import { AllocationDetailService } from './services/allocation-detail.service';
import { AllocDtlsObject, AllocDetails } from './model/alloc-details-model';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-allocdetails',
  templateUrl: './allocdetails.component.html',
  styleUrls: ['./allocdetails.component.scss']
})
export class AllocdetailsComponent implements OnInit, OnChanges {

  @Input() detailsRowData: any;
  @Input() detailsColumnData: any;
  @Input() selectdRowData: any;
  @Output() showDetailsView = new EventEmitter();
  sidebar = false;
  columnNames = [];
  closeResult: string;
  columns: any[] = [];
  defaultColDef = { enableRowGroup: true, enablePivot: true, enableValue: true, sortable: true, resizable: true, filter: true, width: 140 };
  columnDefs;
  sortingOrder = [null, 'asc', 'desc'];
  rowData: any[] = [];
  gridApi: any;
  gridColumnApi: any;
  modules = AllModules;
  rowSelection = 'multiple';
  autoGroupColumnDef = { width: 175 };
  rowGroupPanelShow = 'always';
  pageSize = 25;
  rangeOptions = [25, 50, 100, 500];

  columnList: any[] = [];
  demandData = 0;

  columnsData: any[] = [];
  savedState;
  savedPivotMode;
  persName: any;
  defaultView: any;
  viewList = [];
  pivotPanelShowList: string;
  pivotColumnGroupTotalsList: string;
  pivotRowTotalsList: string;
  autoGroupColumnDefList: { width: number; };
  userName;
  viewId;
  prorationDetails: any;
  allocObj: AllocDtlsObject = new AllocDtlsObject();
  proration;
  minimum;
  reduce;
  constructor(private alDtlsService: AllocationDetailService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.pivotPanelShowList = 'open';
    this.pivotColumnGroupTotalsList = 'after';
    this.pivotRowTotalsList = 'before';
    this.allocObj.allocDtlsObj = [];
  }

  ngOnChanges(change: SimpleChanges): void {
    this.allocObj.allocDtlsObj = [];
    this.getProrationDetails(change.selectdRowData.currentValue.itemCode);
    this.getAllocationDetails(change.selectdRowData.currentValue.itemCode);

    this.setColumns();
  }

  getProrationDetails(itemcode): void {
    const body = { item_code: itemcode };
    this.alDtlsService.getProrationDetails(body).subscribe(
      (resp) => {
        if (resp.data !== [] && resp.data.length > 0) {
          this.prorationDetails = resp.data[0];
          this.demandData = this.prorationDetails.DEMAND;
        }
      },
      (error) => {
      });
  }
  getAllocationDetails(itemcode): void {
    this.spinner.show();
    this.allocObj.allocDtlsObj = new Array<AllocDetails>();
    const body = { item_code: itemcode };
    this.alDtlsService.getAllocationDetails(body).subscribe(
      (resp) => {
        this.spinner.hide();
        const allocDtls = resp.data;
       
        allocDtls.map((item,idx) => {
          const dtlsDastaset = new AllocDetails();
          dtlsDastaset.ALLOCATED_QTY = item.ALLOCATED_QTY;
          dtlsDastaset.ALLOC_SPLIT = item.ALLOC_SPLIT;
          dtlsDastaset.BALANCE_QTY = item.BALANCE_QTY;
          dtlsDastaset.BILLING_TIME = item.BILLING_TIME;
          dtlsDastaset.BUYER_NAME = item.BUYER_NAME;
          dtlsDastaset.CUSTOMER_ID = item.CUSTOMER_ID;
          dtlsDastaset.DEPARTMENT_CODE = item.DEPARTMENT_CODE;
          dtlsDastaset.DIVISION_ID = item.DIVISION_ID;
          dtlsDastaset.INTRANSIT_QTY = item.INTRANSIT_QTY;
          dtlsDastaset.ITEM_CODE = item.ITEM_CODE;
          dtlsDastaset.ITEM_DESCRIPTION = item.ITEM_DESCRIPTION;
          dtlsDastaset.ITEM_SIZE = item.ITEM_SIZE;
          dtlsDastaset.OH_QTY = item.OH_QTY;
          dtlsDastaset.ORDER_ID = item.ORDER_ID;
          dtlsDastaset.ORDER_LINE_ID = item.ORDER_LINE_ID;
          dtlsDastaset.ORDER_TYPE = item.ORDER_TYPE;
          dtlsDastaset.ORGANIZATION_CODE = item.ORGANIZATION_CODE;
          dtlsDastaset.ORIG_ITEM = item.ORIG_ITEM;
          dtlsDastaset.RANKING = item.RANKING;
          dtlsDastaset.REDUCED_BOH = item.REDUCED_BOH;
          dtlsDastaset.REDUCED_ITQ = item.REDUCED_ITQ;
          dtlsDastaset.REQUESTED_QUANTITY = item.REQUESTED_QUANTITY;
          dtlsDastaset.RES_QTY = item.RES_QTY;
          dtlsDastaset.RE_INTRANSIT_QTY = item.RE_INTRANSIT_QTY;
          dtlsDastaset.RE_OH_QTY = item.RE_OH_QTY;
          dtlsDastaset.RE_RES_QTY = item.RE_RES_QTY;
          dtlsDastaset.SOURCE_BOH = item.SOURCE_BOH;
          dtlsDastaset.SSIC = item.SSIC;
          dtlsDastaset.STATUS = item.STATUS;
          dtlsDastaset.SUB_ITEM = item.SUB_ITEM;
          dtlsDastaset.SUB_ITEM_FLAG = item.SUB_ITEM_FLAG;
          dtlsDastaset.FORCE_ALLOCATE = item.FORCE_ALLOCATE;
          dtlsDastaset.SURPLUS_ON_HAND_FLAG = item.SURPLUS_ON_HAND_FLAG;
          dtlsDastaset.EST_ALLOTED_QTY = item.ALLOCATED_QTY;
          dtlsDastaset.IDX = idx + 1;
          this.allocObj.allocDtlsObj.push(dtlsDastaset);
        });
        this.calculateDemand();
        
        this.setColumns();
      },
      (error) => {
        this.spinner.hide();
        this.allocObj.allocDtlsObj = [];
      });
  }
  calculateDemand(): any {
    let demand = 0;
    this.allocObj.allocDtlsObj.map((item) => {
      if (demand === 0) {
        // tslint:disable-next-line: radix
        demand = item.REQUESTED_QUANTITY;
      } else {
        // tslint:disable-next-line: radix
        demand = demand + item.REQUESTED_QUANTITY;
      }
    });
    this.demandData = demand;
  }
  setColumns(): void {
    this.columnDefs = [];
    this.columnDefs = [
      {
        headerName: '', field: '', filter: false, checkboxSelection: true, width: 35,
        rowGroup: false, pivot: true, pinned: 'left', enableValue: false,
      },
      // { headerName: '', field: 'view', width: 50, cellRenderer: ViewIconCellRenderer, pinned: 'left' },
      // { headerName: '', field: 'edit', width: 50, cellRenderer: EditIconCellRenderer, pinned: 'left' },
      { headerName: 'Store #', field: 'CUSTOMER_ID', width: 100, pinned: 'left', cellStyle: { color: '#0084e7' } },
      { headerName: 'Orig Qty', field: 'SOURCE_BOH', width: 100 },
      { headerName: 'Order Qty', field: 'REQUESTED_QUANTITY', width: 100, editable: true },
      { headerName: 'Est Alloc Qty', field: 'EST_ALLOTED_QTY', width: 100 },
      { headerName: 'Sell', field: '', width: 110 },
      { headerName: 'Sub Item', field: 'SUB_ITEM', width: 110 },
      { headerName: 'Sub Qty', field: '', width: 100 },
      { headerName: 'Sub\'ed', field: '', width: 110 },
      { headerName: 'Sub\'ed Qty', field: '', width: 90, cellStyle: { color: '#0084e7' } },
      { headerName: 'Alloc Qty', field: 'ALLOCATED_QTY', width: 80 },
      { headerName: 'Alloc Rank', field: 'RANKING', width: 100 },
      { headerName: 'Sub Force Sell', field: '', width: 125 },
      { headerName: 'Billing', field: 'intransit', width: 100 },
      { headerName: 'Time', field: 'BILLING_TIME', width: 130 },
      { headerName: 'Order Type', field: 'ORDER_TYPE', width: 100 },
      { headerName: 'Force Allocate', field: 'FORCE_ALLOCATE', width: 100 }
    ];
  }

  applyChanges(): void {
    this.spinner.show();
    const selectedData = this.gridApi.getSelectedRows();
    let finalResult;
    selectedData.map((item) => {
      finalResult = (this.proration * item.EST_ALLOTED_QTY) / 100 ;
      const test = finalResult.toFixed(1);
      console.log(test);
      const spliitedResult = finalResult.toString().split('.');
      let finalQty = 0;
      const parseResult = parseInt(spliitedResult[1]);
      const finalOrderQty = parseInt(spliitedResult[0]);
      if ( parseResult >= 5) {
      finalQty = finalOrderQty + 1;
     }else {
      finalQty = finalOrderQty;
     }
    //  console.log(finalQty);
      item.EST_ALLOTED_QTY = finalQty;
    });
    this.allocObj.allocDtlsObj.map((item) => {
      selectedData.map((subItem) => {
        if (item.IDX === subItem.IDX) {
          item.EST_ALLOTED_QTY = subItem.EST_ALLOTED_QTY;
          item.REQUESTED_QUANTITY = (item.REQUESTED_QUANTITY * this.proration) / 100;
          const test = item.REQUESTED_QUANTITY.toFixed(1);
          const spliitedResult = item.REQUESTED_QUANTITY.toString().split('.');
          let finalQty = 0;
          const parseResult = parseInt(spliitedResult[1]);
          const finalOrderQty = parseInt(spliitedResult[0]);
          if ( parseResult >= 5) {
          finalQty = finalOrderQty + 1;
         }else {
          finalQty = finalOrderQty;
         }
          item.REQUESTED_QUANTITY = finalQty;
        }
      });
    });
    this.calculateDemand();
    this.gridApi.setRowData(this.allocObj.allocDtlsObj);
    this.spinner.hide();
  }
  backToReport(): void {
    this.showDetailsView.emit(false);
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  onCellValueChanged(params): void {

    let Demand = 0;
    this.gridApi.forEachNode((node: { data: any; }) => {
      if (Demand === 0) {
        // tslint:disable-next-line: radix
        Demand = parseInt(node.data.REQUESTED_QUANTITY);
      } else {
        // tslint:disable-next-line: radix
        Demand = Demand + parseInt(node.data.REQUESTED_QUANTITY);
      }
    });

    this.demandData = Demand;
  }
  cellClicked(params): void {

  }

}
