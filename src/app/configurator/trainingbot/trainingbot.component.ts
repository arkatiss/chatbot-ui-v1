import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { FormControl, FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfigService } from '../service/config.service';
import { Router } from '@angular/router';
// import { AllModules } from '@ag-grid-enterprise/all-modules';
import { IntentsdropdownComponent } from '../intentsdropdown/intentsdropdown.component';
import { GeneralService } from '../../helper/general.service';
import { ErrorService } from '../../helper/error.service';
import { PagesService } from '../../pages/pages.service';

export interface PeriodicElement {
  date: string;
  priority: string;
  type_of_interaction: string;
  actions: string;
}
@Component({
  selector: 'app-trainingbot',
  templateUrl: './trainingbot.component.html',
  styleUrls: ['./trainingbot.component.scss'],
})
export class TrainingbotComponent implements OnInit {
  selection = new SelectionModel<PeriodicElement>(true, []);
  filteredData: any[] = [];
  displayedColumns: any[] = [];
  iconUrl: any;
  inpudata: any;
  time: any;
  TrainingValues: any[] = [];
  selected = 'New';
  selectedMode = 'chatbot';
  botContextData: any[] = [];
  failedIntent: any;
  editorOptions = new JsonEditorOptions();
  showojsoneditor = false;
  imgurl: any;
  Logdata: any;
  tags: FormGroup | any;
  sqluserform: FormGroup | any;
  tagsData: any[] = [];
  responseData: any[] = [];
  @ViewChild('editor', { static: true }) editor!: JsonEditorComponent;
  filteredIntents: Observable<string[]> | any;
  showTagText = false;
  showTagDrop = true;
  taglength: any;
  showRespText = true;
  showRespDrop = false;
  showPatterns = false;
  showRespTagDrop = true;
  showRespTagText = false;
  patternsData: any[] = [];
  showPatternsDrop = false;
  showPatternsInput = false;
  showResponseInput = false;
  saveBtnDisabeled = true;
  newTag = false;
  userword: any;
  failedUtterance: any;
  utteranceDate: any;
  priority: any;
  response: any;
  totUtteranceData: any[] = [];
  stringData = '';
  showStringData = '';
  totUtteranceIdData: any[] = [];
  dataSource: MatTableDataSource<PeriodicElement> | any;
  @ViewChild(MatPaginator) paginator: MatPaginator | any;
  checkedIntent = false;
  intBody: any[] = [];
  totalNavData: any[] = [];
  modes = ['chatbot', 'customerportal'];
  intentResponses: any;

  columns: any[] = [];
  rowData: any[] = [];
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
  autoGroupColumnDef: { width: number } = {} as any;
  rowGroupPanelShow: any;
  pivotPanelShow: any;
  pivotColumnGroupTotals: any;
  pivotRowTotals: any;
  aggFuncs: any;
  rowSelection: any = 'multiple';
  intent = new FormControl();
  frameworkComponents: any;
  context = { parent: this };
  constructor(
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    public snack: MatSnackBar,
    private fb: FormBuilder,
    private cs: ConfigService,
    private gs: GeneralService,
    private router: Router,
    private error: ErrorService,
    private pageservice: PagesService
  ) {
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.mode = 'tree';
    this.editorOptions.mainMenuBar = true;
    this.editorOptions.navigationBar = true;
    this.editorOptions.statusBar = false;
    const imgUrl = this.gs.getPropertiesUrl();
    this.imgurl = imgUrl.imgPath;
    this.TrainingValues = ['New', 'Pending', 'Completed', 'Rejected'];
    this.tags = this.fb.group({
      tagUser: this.fb.array([]),
      intent: new FormControl(['']),
    });
    this.frameworkComponents = { customRenderer: IntentsdropdownComponent };
    this.tagUser.push(
      this.fb.group({ tagControl: '', responses: '', pattern: '', intent: '' })
    );
    this.getTags();
  }

  ngOnInit(): void {
    // this.onTrainChange(this.selected);
    //this.changeMode();
  }
  get tagUser(): any {
    return this.tags.get('tagUser') as FormArray;
  }

  showInp(): any {
    this.newTag = true;
    this.showTagText = true;
    this.showTagDrop = false;
    this.showPatternsInput = true;
    this.showResponseInput = true;
    this.showRespDrop = false;
    this.showPatternsDrop = false;
    this.intent.setValue('');
  }
  addpatterns(): void {
    this.tagUser.push(this.fb.group({ pattern: '', responses: '' }));
    this.getTags();
  }

  saveResponseAndPatterns(): void {
    if (this.newTag === true) {
      if (this.tags.value.tagUser[0].tagControl === '') {
        this.snack.open('Please enter tag', 'ok', { duration: 1000 });
      } else if (this.tags.value.tagUser[0].pattern === '') {
        this.snack.open('Please enter pattern', 'ok', { duration: 1000 });
      } else if (this.tags.value.tagUser[0].responses === '') {
        this.snack.open('Please enter responses', 'ok', { duration: 1000 });
      } else {
        this.newTag = false;
        const obj = {};
        const patternsObj: any[] = [];
        const responsesObj: any[] = [];
        let respStr = '';
        let patternsStr = '';
        let Patterns = '';
        let Responses = '';
        if (this.tags.value.tagUser[0].tagControl !== '') {
          this.tags.value.tagUser.map((item: any) => {
            if (item.patterns !== '') {
              patternsObj.push(item.pattern);
            }
            if (item.responses !== '') {
              responsesObj.push(item.responses);
            }
          });
          if (responsesObj.length > 0) {
            respStr = responsesObj.toString();
          }
          if (patternsObj.length > 0) {
            patternsStr = patternsObj.toString();
            Patterns = patternsStr.replace(',', '@@@');
            Responses = respStr.replace(',', '@@@');
          }
          this.saveBtnDisabeled = false;
          const body = { yml_type: 'update' };
          Object.assign(body, { tag: this.tags.value.tagUser[0].tagControl });
          Object.assign(body, { patterns: Patterns });
          Object.assign(body, { responses: Responses });

          this.cs.retrainYml(body).subscribe(
            (res: any) => {
              this.onSuccessSavePatternsAndResponses(res);
            },
            (err: any) => {
              this.onErrorr(err);
            }
          );
        } else {
          this.snack.open('Please enter all fields', 'ok', { duration: 1000 });
        }
      }
    }
  }
  onSuccessSavePatternsAndResponses(data: any): void {
    const logId = this.totUtteranceIdData;
    const body = { id: logId, status: 'Completed', retraining_type: 'update' };
    this.cs.retrainingData(body).subscribe(
      (res: any) => {
        this.onSuccessUpdatePatternsAndResponses(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
    this.snack.open(data.msg, 'ok');
    this.onTrainChange('New');
    this.ngOnInit();
  }
  onSuccessUpdatePatternsAndResponses(data: any): void {
    if (data.res_status === true) {
      this.totUtteranceData = [];
      this.totUtteranceIdData = [];
    } else {
      this.snack.open(this.error.handleError(data), 'Ok', { duration: 5000 });
    }
  }
  closeResponseAndPatterns(): void {
    // this.showPatterns = false;
  }
  saveInp(): any {
    this.showTagText = false;
    this.showTagDrop = true;
    // this.tagsData.push({tag:this.tags.controls.tagUser.value[0].tagControl});
    // this.getResponses(this.tags.controls.tagUser.value[0].tagControl);
    // this.responseData = [];
    this.showRespText = true;
    this.showRespDrop = false;
  }
  showRespInp(): any {
    this.showRespTagDrop = false;
    this.showRespTagText = true;
    this.showRespText = true;
    this.showRespDrop = false;
  }
  saveRespInp(): any {
    this.showRespTagDrop = true;
    this.showRespTagText = false;
    this.showRespText = false;
    this.showRespDrop = true;
    this.intent.setValue('');
    this.showTagDrop = true;
    this.showTagText = false;
    this.newTag = false;
  }
  deleteQuery(i: any): any {
    if (this.tagUser.length > 1) {
      this.tagUser.removeAt(i);
    }
  }
  filterDatatable(event: any): void {
    const filterValue: any = event.target.value;
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
    this.gridApi.setQuickFilter(filterValue);
  }
  openContextChat(openContext: TemplateRef<any>, data: any): any {
    this.failedIntent = data.failed_intent;
    const body = { date: data.date, input: data.failed_intent };
    this.cs.retrieveContext(body).subscribe(
      (res: any) => {
        this.onSuccessContext(openContext, res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessContext(openContext: any, data: any): any {
    if (data.res_status === true) {
      this.botContextData = data.data;
      this.dialog.open(openContext, {
        width: '350px',
        maxHeight: 'calc(100vh - 300px)',
        panelClass: 'rounded-dialog',
      });
    }
  }
  onTrainChange(val: any): any {
    this.selected = val;
    this.spinner.show();
    const body = {
      retraining_type: 'retrieve',
      retraining_data_type: val,
      flow_type: this.selectedMode,
    };
    this.cs.retrainingData(body).subscribe(
      (res: any) => {
        this.onSuccessBotTrain(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  changeMode(): any {
    this.onTrainChange(this.selected);
  }

  onSuccessBotTrain(data: any): any {
    if (data.res_status === true) {
      this.rowData = data.data;
      this.filteredData = this.rowData;
      this.columns = [];
      this.columns = [
        {
          headerName: 'S.No',
          field: 'sno',
          cellRenderer: IntentsdropdownComponent,
        },
        {
          headerName: '',
          field: 'checkRender',
          cellRenderer: IntentsdropdownComponent,
          pinned: 'left',
        },
        { headerName: 'Date', field: 'date' },
        { headerName: 'Failed Utterance', field: 'failed_intent' },
        { headerName: 'Priority', field: 'priority' },
        {
          headerName: 'Failure Context',
          field: 'type_of_interaction',
          cellClass: this.StatusCellRenderer,
        },
        {
          headerName: 'Intent',
          field: 'dropdownRender',
          cellRenderer: IntentsdropdownComponent,
          cellRendererParams: { values: this.tagsData },
          // cellEditorParams: { values: this.tagsData },
        },
        {
          headerName: 'Annotation',
          field: 'annotateRender',
          cellRenderer: IntentsdropdownComponent,
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
      this.aggFuncs = { distinct: CountDFunc };

      this.displayedColumns = [
        'select',
        'sno',
        'date',
        'failed_intent',
        'priority',
        'type_of_interaction',
        'actions',
        'annotation',
      ];
      this.dataSource = new MatTableDataSource<PeriodicElement>(this.rowData);
      this.dataSource.paginator = this.paginator;

      this.spinner.hide();
    } else {
      this.spinner.hide();
      this.rowData = [];
      this.snack.open(this.error.handleError(data), 'Ok');
    }
  }
  // isAllSelected() {
  //   const numSelected = this.selection.selected.length;
  //   const numRows = this.dataSource.data.length;
  //   return numSelected === numRows;
  // }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  // masterToggle() {

  //   this.isAllSelected() ?
  //       this.selection.clear() :
  //       this.dataSource.data.forEach(row => this.selection.select(row));
  // }
  rejectedBotTrain(data: any): any {
    Swal.fire({
      title: 'Are you sure want to Discard?',
      text: 'You will not be able to review and recover anymore!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.value) {
        const body = {
          retraining_type: 'update',
          id: this.totUtteranceIdData,
          status: 'Rejected',
        };
        this.cs.retrainingData(body).subscribe(
          (res: any) => {
            this.onSuccessBotDiscard(res);
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
  onSuccessBotDiscard(data: any): any {
    if (data.res_status == true) {
      this.onTrainChange('New');
      this.snack.open(data.msg, 'Ok', { duration: 5000 });
    } else {
      this.snack.open(this.error.handleError(data), 'Ok', { duration: 5000 });
    }
  }
  showJsonEditor(val: any): any {
    // this.showojsoneditor = true;
    this.showPatterns = true;
    // this.filename = file[0];
    this.Logdata = val;
    this.editorOptions.language = 'en';
    this.editorOptions.mode = 'tree';
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.statusBar = false;
  }
  showEditor(): any {}
  onErrorr(data: any): any {
    this.spinner.hide();
    // this.snack.open(data.msg, 'Ok');
    this.snack.open(this.error.handleError(data), 'Ok', { duration: 5000 });
  }
  getTags(): any {
    const body = { yml_type: 'retrieve' };
    this.cs.retrainYml(body).subscribe(
      (res: any) => {
        this.onSuccessTags(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessTags(data: any): any {
    this.onTrainChange(this.selected);
    if (data.res_status === true) {
      this.tagsData = data.data;
      this.pageservice.setIntentsData(this.tagsData);
      this.taglength = this.tagsData.length;
      this.filteredIntents = this.intent.valueChanges.pipe(
        startWith(''),
        map((val) => this.Intentfilter(val))
      );
    } else {
      this.snack.open(this.error.handleError(data), 'Ok', { duration: 5000 });
    }
  }
  getResponsesAndPatterns(val: any): any {
    this.tagsData.map((item: any) => {
      if (item.tag === val) {
        this.responseData = item.responses;
        this.patternsData = item.patterns;
        this.showRespText = false;
        this.showRespDrop = true;
        this.showPatternsDrop = true;
        this.showPatternsInput = false;
        this.showResponseInput = false;
        // this.filteredIntents = this.tagUser.controls['tags'].valueChanges.pipe(
        //   startWith(""),
        //   map(val => this.filter(val))
        // );
      } else {
        // if(item.responses === undefined){
        //     this.showRespText = true;
        //     this.showRespDrop = false;
        // }
      }
    });
  }

  filter(val: any): string[] {
    const filterValue = val.toLowerCase();

    return this.responseData.filter((option) =>
      option.tag.toLowerCase().includes(filterValue)
    );
  }

  Intentfilter(val: any): string[] {
    const filterValue = val.toLowerCase();
    return this.tagsData.filter((option: any) =>
      option.intent.toLowerCase().includes(filterValue)
    );
  }
  onActivate(event: any, openDialog: any): void {
    this.userword = this.showStringData;
    this.intent.setValue('');
    this.dialog.open(openDialog, {
      width: '700px',
      maxHeight: 'calc(100vh - 60px)',
    });
  }
  selectIntent(data: any, event: any, i: any): any {
    if (event.checked === true) {
      this.rowData[i].checked = true;
      this.checkedIntent = false;
      this.totUtteranceData.push(data.failed_intent);
      this.totUtteranceIdData.push(data.id);
      this.totalNavData.push({ utterance: data.failed_intent, id: data.id });
    } else {
      this.rowData[i].checked = false;
      const idx = this.totUtteranceData.findIndex(
        (i) => i === data.failed_intent
      );
      const idxId = this.totUtteranceIdData.findIndex((i) => i === data.id);
      this.totalNavData.splice(idxId, 1);
      this.totUtteranceData.splice(idx, 1);
      this.totUtteranceIdData.splice(idxId, 1);
      this.showTagText = false;
    }
    this.intent.setValue('');
    this.failedUtterance = data.failed_intent;
    this.utteranceDate = data.date;
    this.priority = data.priority;
    this.stringData = '';
    this.showStringData = '';
    for (let i = 0; i < this.totUtteranceData.length; i++) {
      this.stringData = this.stringData + this.totUtteranceData[i] + '@@@';
      this.showStringData =
        this.showStringData + this.totUtteranceData[i] + ',';
    }
    this.showStringData = this.showStringData.substring(
      0,
      this.showStringData.length - 1
    );
    this.stringData = this.stringData.substring(0, this.stringData.length - 3);
  }
  saveIntent(): any {
    let body = {};
    if (this.newTag === true) {
      if (
        this.intent.value === '' ||
        this.intent.value === undefined ||
        this.intent.value === null
      ) {
        this.snack.open('Intent should not be empty', 'ok', { duration: 1000 });
      } else if (
        this.userword === '' ||
        this.userword === undefined ||
        this.userword === null
      ) {
        this.snack.open('Failed Utterance should not be empty', 'ok', {
          duration: 1000,
        });
      } else if (
        this.response === '' ||
        this.response === undefined ||
        this.response === null
      ) {
        this.snack.open('Response should not be empty', 'ok', {
          duration: 1000,
        });
      } else {
        this.newTag = false;
        body = {
          yml_type: 'update',
          tag: this.intent.value,
          patterns: this.stringData,
          responses: this.response,
        };
      }
    } else {
      if (
        this.intent.value === '' ||
        this.intent.value === undefined ||
        this.intent.value === null
      ) {
        this.snack.open('Intent should not be empty', 'ok', { duration: 1000 });
      } else {
        body = {
          yml_type: 'update',
          tag: this.intent.value,
          patterns: this.stringData,
          responses: '',
        };
      }
    }
    this.cs.retrainYml(body).subscribe(
      (res: any) => {
        this.onSuccessSaveIntent(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessSaveIntent(data: any): any {
    if (data.res_status === true) {
      const logId = this.totUtteranceIdData;
      const body = {
        id: logId,
        status: 'Completed',
        retraining_type: 'update',
      };
      this.cs.retrainingData(body).subscribe(
        (res: any) => {
          this.onSuccessUpdatePatternsAndResponses(res);
        },
        (err: any) => {
          this.onErrorr(err);
        }
      );

      this.snack.open(data.msg, 'ok');
      this.onTrainChange('New');
      this.dialog.closeAll();
    } else {
      this.snack.open(this.error.handleError(data), 'Ok', { duration: 5000 });
    }
  }
  onSelectionChange(event: any, value: any, idxNum: any, data: any): void {
    this.intentResponses = data.responses;
    this.checkedIntent = true;
    this.rowData[idxNum].annotate = true;
    this.tagsData.map((item: any) => {
      if (item.intent === event) {
        if (this.intBody.length > 0) {
          const index = this.intBody.findIndex((x) => x.idx === idxNum);
          if (index === -1) {
            this.intBody.push({
              idx: idxNum,
              patterns: value.failed_intent,
              intent: event,
              responses: '',
              id: value.id,
            });
          } else {
            this.intBody[index] = {
              idx: idxNum,
              patterns: value.failed_intent,
              intent: event,
              responses: '',
              id: value.id,
            };
          }
        } else {
          this.intBody.push({
            idx: idxNum,
            patterns: value.failed_intent,
            intent: event,
            responses: '',
            id: value.id,
          });
        }
      }
    });
  }

  saveIntentInSelectionMode(): any {
    const body = { yml_type: 'update', retrain_data: this.intBody };

    this.cs.retrainYml(body).subscribe(
      (res: any) => {
        this.onSuccessSaveSelectionMode(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSaveResponses(data: any): void {
    this.intentResponses = data.responses;
  }
  navigateAnnotation(data: any): void {
    // this.saveIntentInSelectionMode();
    this.dialog.closeAll();
    const intent = this.intent.value;
    if (intent === '' || intent === null || intent === undefined) {
      this.snack.open('Intent should not be empty', 'ok', { duration: 1000 });
    } else {
      data.map((item: any) => {
        item.intent = intent;
        Object.assign(item, { responses: this.intentResponses });
      });
      this.pageservice.setAnnotationData(data);
      this.router.navigateByUrl('/config/createtraining');
    }
  }
  onSuccessSaveSelectionMode(data: any): any {
    if (data.res_status === true) {
      this.intent.setValue('');
      const logId: any[] = [];
      this.intBody.map((item) => {
        logId.push(item.id);
      });
      const body = {
        id: logId,
        status: 'Completed',
        retraining_type: 'update',
      };
      this.cs.retrainingData(body).subscribe(
        (res: any) => {
          this.onSuccessUpdatePatternsAndResponses(res);
        },
        (err: any) => {
          this.onErrorr(err);
        }
      );
      this.snack.open(data.msg, 'ok');
      this.onTrainChange('New');
    } else {
      this.snack.open(this.error.handleError(data), 'Ok', { duration: 5000 });
    }
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
  onCellItemCodeClicked(params: any, openContext: any): void {
    if (params.colDef.field === 'type_of_interaction') {
      this.openContextChat(openContext, params.data);
    }
  }
  StatusCellRenderer(params: any): any {
    return params.value === 'casual'
      ? 'statuspointer'
      : params.value === 'Future'
      ? 'bg-colorIndicator3'
      : 'bg-colorIndicator2';
  }
  getSelectedIntent(evt: any): void {
    const data = this.gridApi.getSelectedNodes();
    data.map((item: any) => {
      this.selectIntent(item.data, true, item.rowIndex);
    });
  }
  displayFn(option: any): string {
    if (!option) return '';
    return option.intent;
  }
  changeInfoset(sqluserform: any, SQLIndex: any) {}
  getData(event: any) {}
  closeContext() {
    this.dialog.closeAll();
  }
}
function CountDFunc(params: any): any {
  // return 'xyz';
  const obj = [...new Set(params)];
  return obj.length;
}
