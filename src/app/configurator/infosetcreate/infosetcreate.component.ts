import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  Validators,
  FormBuilder,
} from '@angular/forms';
import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragExit,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Item } from '../../shared/models/item';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  BsModalRef,
  BsModalService,
  ModalDirective,
} from 'ngx-bootstrap/modal';
import { MatSnackBar } from '@angular/material/snack-bar';

import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import * as uuid from 'uuid';

import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConfigService } from '../service/config.service';
import { CommonService } from '../../helper/common.service';
@Component({
  selector: 'app-infosetcreate',
  templateUrl: './infosetcreate.component.html',
  styleUrls: ['./infosetcreate.component.scss'],
})
export class InfosetcreateComponent implements OnInit {
  domain: any;
  subdomain: any;
  databaseArray: any[] = [];
  hierarchyValues: any[] = [];
  infosetform: FormGroup | any;
  addForm: FormGroup | any;
  public parentItem: Item;
  domaintrue = false;
  subdomaintrue = false;
  tempData: any[] = [];
  showPreviewBtn = false;
  saveJsonFile = false;
  showPreviewDiv = false;
  previewDtls: any[] = [];
  modalRef: BsModalRef | any;
  domainForm: FormGroup | any;
  tab: any = 'tab1';
  tab1: any;
  tab2: any;
  tab3: any;
  tab4: any;
  operation = 'Operation';
  showfile = false;
  duration = true;
  addText: string | any;
  config = {
    backdrop: true,
    ignoreBackdropClick: true,
  };
  AdjOrComm: string | any;
  userName: any;
  showtable = false;
  subinfydomain: any;
  infydomain: any;
  logScreen = false;
  selectInfoset: any;
  submitbtn = false;
  opvalue = false;
  opinput = true;
  infosets: any[] = [];
  OptforAdjComm: string[] = ['Adjustmets', 'Comments'];
  categories = [
    { name: 'Data Retrieval', field: 'data_retrieval' },
    { name: 'Data Entry', field: 'data_entry' },
  ];
  @ViewChild(DatatableComponent, { static: false }) table:
    | DatatableComponent
    | any;
  @ViewChild('autoShownModal', { static: false }) autoShownModal:
    | ModalDirective
    | any;
  @ViewChild('abcd', { static: true })
  domainval: any;
  domainnames: any;
  appcompList: any;
  temps: any[] = [];
  previewDtls2: any[] = [];
  domainDetails: any[] = [];
  subDomainDetails: any[] = [];
  masterDetails: any[] = [];
  jsonfilenameData: any;
  operationTypes: any[] = [];
  showmasterdata = true;
  forms = [];
  formvalue = false;
  masterDataType: any;
  submitText: any;

  infosetData: any = [];
  infosetData2: any = [];
  infoset: any;
  selectedStates: any;
  chainData2: any[] = [];
  chainData3: any[] = [];
  chainData4: any[] = [];
  selectedChainType: any;
  selectedChainParamsValue: any;
  selectedStrGrpType: any;
  selectedStrGrpParamsValue: any;
  selectedStrType: any;
  selectedStrParamsValue: any;
  storeData: any[] = [];
  storegroupData: any[] = [];
  chainData: any[] = [];
  storegroupData2: any[] = [];
  storegroupData3: any[] = [];
  storegroupData4: any[] = [];
  storeData2: any[] = [];
  storeData4: any[] = [];
  storeData3: any[] = [];
  userNames: any;
  AdminDetails: any[] = [];
  chainNbr: any[] = [];
  orderShow = false;
  orderTypes: { op_type: string; field: string }[] = [];
  attrValues: { op_type: string; field: string }[] = [];
  Logdata: any;
  unique_id: number | any;
  showdata: any;
  filename: any;
  //infosets: any;
  infosets2: any[] = [];
  selectBoxes: any[] = [];
  chainsDataDynamic: any[] = [];

  dynamicSelection: any[] = [];
  dynamicArray: any[] = [];
  UpdateDynamicArray: any[] = [];
  catName: any;
  operationVal: any;
  oplink = false;
  showtd = false;
  showtd2 = true;
  tdtpes: any[] = [];
  attr: any;
  addbuttonshow = false;
  showForm = false;
  oplinktext = 'Operation Link';
  connectorlist: any;
  connector: any;
  query: any;
  showtoggle = false;

  selectedToppings: any;
  nodess = [];
  nodeData = [];
  filteredDomainOptions: Observable<string[]> | any;
  filteredSubDomainOptions: Observable<string[]>;
  shownewInfoset = true;
  newAddedDomain = true;
  securityFlag = 'private';
  subDomain: any;
  tempSecuriryFlag: any;
  public get connectedDropListsIds(): string[] {
    // We reverse ids here to respect items nesting hierarchy
    return this.getIdsRecursive(this.parentItem).reverse();
  }
  filteredInfosetOptions: Observable<string[]> | any;
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    public snack: MatSnackBar,
    private common: CommonService,
    private dialog: MatDialog,
    private cs: ConfigService
  ) {
    this.infosetform = this.fb.group({
      domain_name: new FormControl(''),
      sub_domain: new FormControl(''),
      infosetControl: new FormControl(''),
      securityFlag: new FormControl(false),
    });
    this.filteredDomainOptions = this.infosetform.controls[
      'domain_name'
    ].valueChanges.pipe(
      startWith(''),
      map((val: any) => this.filter(val))
    );
    this.filteredSubDomainOptions = this.infosetform.controls[
      'sub_domain'
    ].valueChanges.pipe(
      startWith(''),
      map((val: any) => this.subfilter(val))
    );

    this.filteredInfosetOptions = this.infosetform.controls[
      'infosetControl'
    ].valueChanges.pipe(
      startWith(''),
      map((value: any) => (typeof value === 'string' ? value : value.fileName)),
      map((name: any) =>
        name.fileName
          ? this.infosetFilter(name.fileName)
          : this.infosets.slice()
      )
    );
    this.domainForm = this.fb.group({
      domain_val: ['', Validators.required],
      sub_domain_val: ['', Validators.required],
    });

    this.addForm = this.fb.group({
      operation_type: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      uniqueId: [''],
      attr_type: ['', Validators.required],
      attr_name: [''],
      attr_ref: [''],
      oper_link: [''],
      oper_output: [''],
      oper_value: [''],
    });
    this.parentItem = new Item({
      operation_type: '',
      category: '',
      attr_type: '',
      attr_name: '',
      attr_ref: '',
      uniqueId: '',
      oper_link: '',
      oper_output: '',
      oper_value: '',
      description: '',
      title: '',
    });
  }
  ngOnInit(): void {
    this.retrieveDomain();
  }
  private infosetFilter(name: string): string[] {
    const filterValue = name.toLowerCase();
    return this.infosets.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  showFormDiv(): void {
    this.showForm = true;
    this.submitText = 'Submit';
    this.newAddedDomain = false;
    const subDomainVal = this.subDomain;
    const domainVal = this.infosetform.get('domain_name').value;
    this.jsonfilenameData = this.infosetform.get('infosetControl').value;
    const body = {
      json_format: {
        domain: domainVal,
        sub_domain: subDomainVal,
        category: 'data_entry',
        security_flag: this.securityFlag,
      },
      file: this.jsonfilenameData,
      infoset_type: 'insert',
    };
    this.cs.saveInfoset(body).subscribe(
      (res: any) => {
        this.onSuccesssInfo(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );

    this.AddNewData();
    //this.addnewInfoset();
  }
  filter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.domainDetails.filter((option) =>
      option.domain.toLowerCase().includes(filterValue)
    );
  }

  subfilter(val: string): string[] {
    const filterValue = val.toLowerCase();
    return this.subDomainDetails.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  private getIdsRecursive(item: Item): string[] {
    let ids = [item.uniqueId];
    item.childs.forEach((childItem) => {
      ids = ids.concat(this.getIdsRecursive(childItem));
    });
    return ids;
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: error,
    });
  }
  createItem(): FormGroup {
    return this.fb.group({
      sub_domain_details: '',
    });
  }
  subForm(a: any): void {
    this.hierarchyValues.push(a);
  }
  public onDragDrop(event: CdkDragDrop<Item>): any {
    event.container.element.nativeElement.classList.remove('active');
    if (this.canBeDropped(event)) {
      const movingItem: Item = event.item.data;
      event.container.data.childs.push(movingItem);
      event.previousContainer.data.childs =
        event.previousContainer.data.childs.filter(
          (child) => child.uniqueId !== movingItem.uniqueId
        );
    } else {
      moveItemInArray(
        event.container.data.childs,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
  private canBeDropped(event: CdkDragDrop<Item, Item>): boolean {
    const movingItem: Item = event.item.data;
    return (
      event.previousContainer.id !== event.container.id &&
      this.isNotSelfDrop(event) &&
      !this.hasChild(movingItem, event.container.data)
    );
  }
  private isNotSelfDrop(
    event: CdkDragDrop<Item> | CdkDragEnter<Item> | CdkDragExit<Item>
  ): boolean {
    return event.container.data.uniqueId !== event.item.data.uId;
  }
  private hasChild(parentItem: Item, childItem: Item): boolean {
    const hasChild = parentItem.childs.some(
      (item) => item.uniqueId === childItem.uniqueId
    );
    return hasChild
      ? true
      : parentItem.childs.some((item) => this.hasChild(item, childItem));
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
  selectDomainForInfoset(val: any): any {
    this.domainDetails.forEach((element) => {
      this.infosetform.get('sub_domain').setValue('');
      this.infosetform.get('infosetControl').setValue('');
      if (element.domain === val) {
        this.subDomainDetails = element.sub_domain;
        this.filteredSubDomainOptions = this.infosetform.controls[
          'sub_domain'
        ].valueChanges.pipe(
          startWith(''),
          map((val: any) => this.subfilter(val))
        );
      }
    });

    if (this.subDomainDetails.length > 0) {
      this.addbuttonshow = true;
    }
  }

  changeSubDomainForInfoset(value: any): any {
    // this.unique_id = Math.floor(100000 + Math.random() * 9000);
    this.subDomain = value;
    const domainVal = this.infosetform.get('domain_name').value;
    this.infosetform.get('infosetControl').setValue('');
    // const body = {
    //   master_data_type: 'retrieve', domain: domainVal,
    //   sub_domain: subDomainVal, id: this.unique_id
    // };
    // this.cs.chatbotMasterData(body).subscribe(
    //   (res:any) => {
    //     this.onSuccessschangesub(res);
    //   },
    //   (err:any) => {
    //     this.onErrorr(err);
    //   }
    // );
    const body = {
      infoset_type: 'retrieve',
      domain: domainVal,
      sub_domain: this.subDomain,
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

  changeInfosetForTable(value: any, val: any): any {
    this.tempSecuriryFlag = val.security_flag;
    if (val.security_flag === 'public') {
      this.infosetform.get('securityFlag').setValue(true);
    } else {
      this.infosetform.get('securityFlag').setValue(false);
    }
    const domainVal = this.infosetform.get('domain_name').value;
    this.unique_id = Math.floor(100000 + Math.random() * 9000);
    const body = {
      master_data_type: 'retrieve',
      domain: domainVal,
      sub_domain: this.subDomain,
      id: this.unique_id,
      infoset: value,
    };
    this.cs.chatbotMasterData(body).subscribe(
      (res: any) => {
        this.onSuccessschangesub(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  addnewInfoset(): any {
    this.shownewInfoset = !this.shownewInfoset;
    this.infosetform.get('infosetControl').setValue('');
    this.newAddedDomain = !this.newAddedDomain;
    this.masterDetails = [];
  }
  changeSubDomainForInfoset2(): any {
    const subDomainVal = this.infosetform.get('sub_domain').value;
    const domainVal = this.infosetform.get('domain_name').value;
    const infosetVal = this.infosetform.get('infosetControl').value;
    const body = {
      master_data_type: 'retrieve',
      domain: domainVal,
      sub_domain: subDomainVal,
      id: this.unique_id,
      infoset: infosetVal,
    };
    this.cs.chatbotMasterData(body).subscribe(
      (res: any) => {
        this.onSuccessschangesub(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessschangesub(datas: any): any {
    // this.showtable = true;
    this.AddNewData();
    if (datas.res_status === true) {
      // this.masterDetails = [];
      if (datas.data.length > 0) {
        this.masterDetails = datas.data;
      }
      console.log(this.masterDetails);
      if (this.masterDetails.length > 0) {
        this.showtable = true;
      } else {
        this.showtable = false;
      }

      this.forms = JSON.parse(datas.forms);
    } else {
      this.masterDetails = [];
    }
  }

  onSuccessInfoView(data: any): any {
    if (data.res_status === true) {
      //console.log(data.data);
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
          security_flag: a.security_flag,
        });
      }
      // console.log(this.infosets);
    } else {
      this.infosets = [];
    }
  }
  cancel(): any {
    this.spinner.hide();
    this.common.http.cancelCall();
  }
  drop(event: any, rowData: any, rowIndex: any): any {
    console.log(rowIndex);
    if (event.checked) {
      const drageedDataArray = [];
      drageedDataArray.push(rowData);
      this.tempData = [...drageedDataArray];
      this.tempData.map((item) => {
        if (item.category === 'data_entry') {
          this.parentItem.childs.push(
            new Item({
              operation_type: item.operation_type,
              category: item.category,
              attr_type: item.attr_type,
              description: item.description,
              attr_name: item.attr_name,
              attr_ref: item.attr_ref,
              uniqueId: item.uniqueId,
              oper_link: item.oper_link,
              oper_output: item.oper_output,
              oper_value: item.oper_value,
              childs: [],
              title: item.attr_name,
              // parentIdx: rowIndex,
              // index: rowIndex
            })
          );
        } else {
          this.parentItem.childs.push(
            new Item({
              operation_type: item.operation_type,
              category: item.category,
              attr_type: item.attr_type,
              description: item.description,
              attr_name: item.attr_name,
              attr_ref: item.attr_ref,
              uniqueId: item.uniqueId,
              oper_link: item.oper_link,
              oper_output: item.oper_output,
              oper_value: item.oper_value,
              title: item.attr_name,
              // children: [
              // ]
            })
          );
          this.previewDtls2.push(item);
        }
      });
    } else {
      this.parentItem.childs.splice(rowIndex, 1);
      this.previewDtls2.splice(rowIndex, 1);
    }
    console.log(this.parentItem.childs);
    this.showPreviewBtn = true;
  }
  showPreview(openPreviewPopup: any): any {
    this.showPreviewDiv = true;
    this.previewDtls = [];
    this.jsonfilenameData = this.infosetform.get('infosetControl').value;
    this.parentItem.childs.map((val) => {
      this.previewDtls.push(val);
    });
    console.log(this.previewDtls);
    this.modalRef = this.modalService.show(
      openPreviewPopup,
      Object.assign({}, { class: 'gray modal-md' })
    );
  }
  ClearData(): any {
    this.parentItem.childs = [];
    this.previewDtls = [];
    this.previewDtls2 = [];
    // this.masterDetails = [];
  }
  toggleSaveDiv(): any {
    this.saveJsonFile = true;
  }
  saveJson(): any {
    let prvDetails: any[] = [];
    this.tempData.map((item) => {
      if (item.category === 'data_entry') {
        prvDetails = this.previewDtls;
      } else {
        prvDetails = this.previewDtls2;
      }
    });
    const subDomainVal = this.subDomain;
    const domainVal = this.infosetform.get('domain_name').value;
    const domainData = { domain: domainVal, sub_domain: subDomainVal };
    const body = {
      json_format: { domain_data: domainData, infoset_data: prvDetails },
      file: this.jsonfilenameData,
    };
    this.cs.saveInfoset(body).subscribe(
      (res: any) => {
        this.onSuccesssInfo(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssInfo(datas: any): any {
    if (datas.res_status === true) {
      this.snack.open(datas.msg, 'Ok');
      this.modalRef.hide();
      this.ClearData();
    } else {
      this.snack.open(datas.msg, 'Ok');
      this.modalRef.hide();
    }
  }
  changeSecurity(evt: any): void {
    if (this.tempSecuriryFlag === undefined) {
      if (evt.checked === true) {
        this.securityFlag = 'public';
      } else {
        this.securityFlag = 'private';
      }
    } else {
      if (evt.checked === true) {
        this.securityFlag = 'public';
      } else {
        this.securityFlag = 'private';
      }
      this.updateSecurityFlag();
    }
  }
  updateSecurityFlag(): void {
    const subDomainVal = this.subDomain;
    const domainVal = this.infosetform.get('domain_name').value;
    this.jsonfilenameData = this.infosetform.get('infosetControl').value;
    const body = {
      json_format: {
        domain: domainVal,
        sub_domain: subDomainVal,
        category: 'data_entry',
        security_flag: this.securityFlag,
      },
      file: this.jsonfilenameData,
      infoset_type: 'update',
    };
    this.cs.saveInfoset(body).subscribe(
      (res: any) => {
        this.onSuccessUpdateFlag(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessUpdateFlag(data: any): void {
    console.log(data);
  }
  AddNewData(): any {
    const a = this.infosetform.get('domain_name').value;
    const b = this.subDomain;
    const c = this.infosetform.get('infosetControl').value;
    if (a === '') {
      Swal.fire({
        icon: 'error',
        text: 'select domain',
      });
    } else if (b === '') {
      Swal.fire({
        icon: 'error',
        text: 'select sub domain',
      });
    } else if (c === '') {
      Swal.fire({
        icon: 'error',
        text: 'select Infoset',
      });
    } else {
      this.showForm = true;
      this.addText = 'Add Infoset Data';
      this.submitText = 'Submit';
      this.addForm.reset();
      this.masterDataType = 'insert';
      this.addForm.get('uniqueId').patchValue(uuid.v4());
      //this.dialog.open(openAddData, { width: 'max-content', maxHeight: 'calc(100vh - 60px)' });
    }
  }
  addNewHierachyData(val: any, masterDatatype: any): any {
    if (this.addForm.valid) {
      // this.masterDetails = [];
      this.spinner.show();
      const subDomainVal = this.subDomain;
      const domainVal = this.infosetform.get('domain_name').value;
      const infosetVal = this.infosetform.get('infosetControl').value;

      let operationType;
      let description;
      let category;
      let attrType;
      let attrName;
      let attrRef;
      let operLink;
      let operOutput;
      let operValue;
      let masterDataId;
      this.unique_id = Math.floor(100000 + Math.random() * 9000);
      if (val.operation_type === null || val.operation_type === '') {
        operationType = 'NA';
      } else {
        operationType = val.operation_type;
      }
      if (val.description === null || val.description === '') {
        description = 'NA';
      } else {
        description = val.description;
      }
      if (val.category === null || val.category === '') {
        category = 'NA';
      } else {
        category = val.category;
      }
      if (val.attr_type === null || val.attr_type === '') {
        attrType = 'NA';
      } else {
        attrType = val.attr_type;
      }
      if (val.attr_name === null || val.attr_name === '') {
        attrName = 'NA';
      } else {
        attrName = val.attr_name;
      }
      if (val.attr_ref === null || val.attr_ref === '') {
        const a = '["NA"]';
        attrRef = a;
      } else {
        attrRef = val.attr_ref;
      }
      if (
        val.oper_link === null ||
        val.oper_link === '' ||
        val.oper_link[0] === ''
      ) {
        operLink = 'NA';
      } else {
        operLink = val.oper_link;
      }
      if (val.oper_output === null || val.oper_output === '') {
        operOutput = 'NA';
      } else {
        operOutput = val.oper_output;
      }
      if (val.oper_value === null || val.oper_value === '') {
        operValue = 'NA';
      } else {
        operValue = val.oper_value;
      }
      if (masterDatatype === 'delete') {
        masterDataId = val.master_data_id;
      } else {
        if (val.uniqueId === null) {
          masterDataId = uuid.v4();
        } else {
          masterDataId = val.uniqueId;
        }
      }
      const dataValues = {
        operation_type: [operationType],
        description: [description],
        category: [category],
        master_data_id: [masterDataId],
        domain: [domainVal],
        sub_domain: [subDomainVal],
        attr_type: [attrType],
        attr_name: [attrName],
        attr_ref: [attrRef.replace(/'/g, '"')],
        oper_link: [operLink],
        oper_output: [operOutput],
        oper_value: [operValue],
        id: [this.unique_id],
        infoset: infosetVal,
      };
      const body = {
        master_store_data: dataValues,
        master_data_type: masterDatatype,
      };
      this.cs.chatbotMasterData(body).subscribe(
        (res: any) => {
          this.onSuccesssNewHierachy(this.masterDataType, res);
        },
        (err: any) => {
          this.onErrorrNewHierachy(err);
        }
      );
    } else {
      this.validateAllFields(this.addForm);
    }
  }
  deleteHierachyData(val: any, masterDatatype: any): any {
    const subDomainVal = this.infosetform.get('sub_domain').value;
    const domainVal = this.infosetform.get('domain_name').value;
    let operationType;
    let description;
    let category;
    let attrType;
    let attrName;
    let attrRef;
    let operLink;
    let operOutput;
    let operValue;
    let masterDataId;
    if (val.operation_type === null || val.operation_type === '') {
      operationType = 'NA';
    } else {
      operationType = val.operation_type;
    }
    if (val.description === null || val.description === '') {
      description = 'NA';
    } else {
      description = val.description;
    }
    if (val.category === null || val.category === '') {
      category = 'NA';
    } else {
      category = val.category;
    }
    if (val.attr_type === null || val.attr_type === '') {
      attrType = 'NA';
    } else {
      attrType = val.attr_type;
    }
    if (val.attr_name === null || val.attr_name === '') {
      attrName = 'NA';
    } else {
      attrName = val.attr_name;
    }
    if (val.attr_ref === null || val.attr_ref === '') {
      const a = '["NA"]';
      attrRef = a;
    } else {
      attrRef = val.attr_ref;
    }
    if (val.oper_link === null || val.oper_link === '') {
      operLink = 'NA';
    } else {
      operLink = val.oper_link;
    }
    if (val.oper_output === null || val.oper_output === '') {
      operOutput = 'NA';
    } else {
      operOutput = val.oper_output;
    }
    if (val.oper_value === null || val.oper_value === '') {
      operValue = 'NA';
    } else {
      operValue = val.oper_value;
    }
    if (masterDatatype === 'delete') {
      masterDataId = val.master_data_id;
    } else {
      masterDataId = val.uniqueId;
    }
    const dataValues = {
      operation_type: [operationType],
      description: [description],
      category: [category],
      master_data_id: [masterDataId],
      domain: [domainVal],
      sub_domain: [subDomainVal],
      attr_type: [attrType],
      attr_name: [attrName],
      attr_ref: [attrRef.replace(/'/g, '"')],
      oper_link: [operLink],
      oper_output: [operOutput],
      oper_value: [operValue],
      id: [this.unique_id],
    };
    const body = {
      master_store_data: dataValues,
      master_data_type: masterDatatype,
    };

    this.cs.chatbotMasterData(body).subscribe(
      (res: any) => {
        this.onSuccesssNewHierachy(this.masterDataType, res);
      },
      (err: any) => {
        this.onErrorrNewHierachy(err);
      }
    );
  }
  validateAllFields(formGroup: FormGroup): any {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFields(control);
      }
    });
  }
  onSuccesssNewHierachy(type: any, datas: any): any {
    if (datas.res_status === true) {
      this.changeSubDomainForInfoset2();
      this.closedialog();
      this.addForm.reset();
      this.spinner.hide();
      if (type === 'update') {
        this.submitText = 'submit';
      }
      Swal.fire({
        icon: 'success',
        text: datas.msg,
      });
    } else {
      this.closedialog();
      this.addForm.reset();
      this.spinner.hide();
      Swal.fire({
        icon: 'error',
        text: datas.msg,
      });
    }
  }
  onErrorrNewHierachy(error: any): any {
    this.addForm.reset();
    this.closedialog();
    Swal.fire({
      icon: 'error',
      text: error,
    });
  }
  selectCategory(catName: any): any {
    // this.addForm.reset();
    this.catName = catName;
    this.attrValues = [];
    this.operationTypes = [];
    this.orderTypes = [];
    this.tdtpes = [];
    if (catName === 'data_retrieval') {
      if (this.catName === 'data_retrieval' && this.attr === 'td') {
        this.showtd = true;
        this.showtd2 = false;
        this.tdtpes = [
          { op_type: 'Summary', field: 'summary' },
          { op_type: 'Detail', field: 'detail' },
          { op_type: 'Aggregation', field: 'aggregation' },
        ];
      } else {
        this.showtd = false;
        this.showtd2 = true;
      }
      const values = [
        { op_type: 'Api', field: 'api' },
        { op_type: 'Script', field: 'script' },
        { op_type: 'Sql', field: 'sql' },
        { op_type: 'Fixed', field: 'fixed' },
      ];
      this.attrValues = [
        { op_type: 'MD', field: 'md' },
        { op_type: 'TD', field: 'td' },
        { op_type: 'NAV', field: 'nav' },
      ];
      this.operationTypes = values;
      this.duration = true;
      this.formvalue = false;
      this.orderShow = false;
      this.operation = 'Operation';
      this.oplink = false;
      // this.selectOperation('link');
    } else if (catName === 'data_entry') {
      this.addForm.patchValue({
        operation_type: [''],
      });
      this.oplinktext = 'Operation Link';
      this.showtd = false;
      this.showtd2 = true;
      this.orderShow = true;
      this.duration = false;
      this.formvalue = true;
      this.addForm.patchValue({
        oper_link: [''],
      });
      this.attrValues = [{ op_type: 'NAV', field: 'nav' }];
      this.orderTypes = [
        { op_type: 'Previous Orders', field: 'previous_orders' },
        { op_type: 'New Orders', field: 'new_orders' },
      ];
      const values = [
        { op_type: 'NA', field: 'NA' },
        { op_type: 'Link', field: 'link' },
        { op_type: 'Browse', field: 'browse' },
        { op_type: 'Form', field: 'form' },
        { op_type: 'Input', field: 'input' },
        { op_type: 'Output', field: 'output' },
      ];
      this.operationTypes = values;
    }
  }
  selectAttribute(attr: any): any {
    this.attr = attr;
    if (this.catName === 'data_retrieval' && attr === 'td') {
      this.showtd = true;
      this.showtd2 = false;
      this.tdtpes = [
        { op_type: 'Summary', field: 'summary' },
        { op_type: 'Detail', field: 'detail' },
        { op_type: 'Aggregation', field: 'aggregation' },
      ];
    } else {
      this.showtd = false;
      this.showtd2 = true;
    }
  }
  selectOperation(operation: any, openConnectors: TemplateRef<any>): any {
    this.operationVal = operation;
    if (this.catName === 'data_retrieval') {
      if (this.operationVal === 'fixed' && this.catName === 'data_retrieval') {
        this.oplink = false;
        this.opvalue = true;
        this.opinput = false;
        // this.opvalue = true;
      } else if (
        this.operationVal === 'script' &&
        this.catName === 'data_retrieval'
      ) {
        this.oplink = false;
        this.opvalue = false;
        this.opinput = true;
      } else if (
        this.operationVal === 'sql' &&
        this.catName === 'data_retrieval'
      ) {
        this.dialog.open(openConnectors, {
          width: 'max-content',
          maxHeight: 'calc(100vh - 60px)',
        });
        // this.dialog.open();
        this.showConnectorsList();
        this.oplink = true;
        this.oplinktext = 'Enter Query';
        this.opvalue = false;
        this.opinput = false;
      } else {
        this.addForm.patchValue({
          oper_link: [''],
        });
        this.oplinktext = 'Operation Link';
        this.oplink = true;
        this.opvalue = true;
        this.opinput = true;
        this.opvalue = false;
      }
    } else {
      if (this.operationVal === 'link' && this.catName === 'data_entry') {
        this.oplink = true;
        this.opinput = false;
        this.duration = false;
        this.showfile = false;
      } else if (
        this.operationVal === 'browse' &&
        this.catName === 'data_entry'
      ) {
        this.showfile = true;
        this.oplink = false;
        this.duration = false;
      } else if (
        this.operationVal === 'input' &&
        this.catName === 'data_entry'
      ) {
        this.duration = true;
        this.oplink = true;
        this.opinput = false;
      } else {
        this.opvalue = false;
        this.showfile = false;
        this.oplink = false;
        this.opinput = false;
        this.duration = false;
      }
    }

    // if (operation === 'link') {
    //   this.operation = 'Paste Link Here';
    //   this.showfile = false;
    //   this.showmasterdata = true;
    // } else if (operation === 'browse') {
    //   this.operation = 'Browse File';
    //   this.showmasterdata = false;
    //   this.showfile = true;
    // }
  }
  showConnectorsList(): any {
    const body = {};
    this.cs.showConnectorsList(body).subscribe(
      (res: any) => {
        this.onSuccesssConnectorList(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssConnectorList(data: any): any {
    if (data.res_status === true) {
      console.log(data.data.name);
      this.connectorlist = data.data;
    }
  }
  closedialog(): any {
    this.dialog.closeAll();
  }
  editData(editValues: any): any {
    this.addText = 'Update Infoset Data';
    this.masterDataType = 'update';
    this.submitText = 'Update';
    this.addForm.patchValue({
      operation_type: editValues.operation_type,
      description: editValues.description,
      category: editValues.category,
      uniqueId: editValues.master_data_id,
      attr_type: editValues.attr_type,
      attr_name: editValues.attr_name,
      attr_ref: editValues.attr_ref,
      oper_link: editValues.oper_link,
      oper_output: editValues.oper_output,
      oper_value: editValues.oper_value,
    });
    this.selectCategory(editValues.category);
  }

  onError(error: any): any {
    console.log(error);
    this.spinner.hide();
    this.snack.open('No response received for your request', 'OK', {
      duration: 5000,
    });
  }

  closePopup(): any {
    this.modalRef.hide();
  }
  addQry(): any {
    if (this.connector === '' || this.connector === undefined) {
      Swal.fire({
        icon: 'error',
        text: 'select connector',
      });
    } else if (this.query === '' || this.query === undefined) {
      Swal.fire({
        icon: 'error',
        text: 'Enter command',
      });
    } else {
      this.addForm.patchValue({
        oper_link: this.connector + '@@@' + this.query,
      });
      this.dialog.closeAll();
    }
  }
  displayFn(option: any): string {
    if (!option) return '';
    return option.fileName || option.domain || option;
  }
}
