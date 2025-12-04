import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GeneralService } from '../../helper/general.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';
import { ApicallService } from '../apiservice/apicall.service';
@Component({
  selector: 'app-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
})
export class ChatboxComponent implements OnInit {
  @ViewChild(MatMenuTrigger) trigger: MatMenuTrigger | any;

  showgrid = false;
  vals: any[] = [];
  keyvals: any[] = [];
  claimform: FormGroup | any;
  salesform: FormGroup | any;
  purchaseform: FormGroup | any;
  enquiryform: FormGroup | any;
  genenquiryform: FormGroup | any;
  salessubform: FormGroup | any;
  purcchsubform: FormGroup | any;
  damageform: FormGroup | any;
  returnorderform: FormGroup | any;

  dealsuiform: FormGroup | any;
  vendorform: FormGroup | any;
  callbackForm: FormGroup | any;
  vendorbackForm: FormGroup | any;
  payboxForm: FormGroup | any;
  Formvalue: any;
  item_name: AnalyserNode | any;
  item_price: any;
  sales_items: any[] = [];
  item_name_pur: any;
  item_price_pur: any;
  purch_items: any[] = [];
  invvalues: any[] = [];
  showemptytable = false;
  linktext: any;
  doclink = false;
  sortingOrder: any[] = [];
  infoval: any;
  textval: string | any;
  showForm: any;
  constructor(
    private http: HttpClient,
    private general: GeneralService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private api: ApicallService
  ) {}

  ngOnChanges(): void {}

  ngOnInit(): void {
    this.general.getFormData().subscribe((info: any) => {
      if (Object.keys(info).length === 0) {
        // this.previewImg = true;
        // this.claimformval = false;
        // this.salesorder = false;
        // this.purchaseorder = false;
        // this.general_enquiry = false;
        // this.returnorder_form = false;
        // this.damage_form = false;
        // this.deals_ui_form = false;
        // this.vendor_form = false;
        // this.enquiry_form = false;
      } else {
        this.infoval = info;
        if (info.form_type === 'form') {
          this.showForm = info.entry_forms.toLowerCase();
        }
      }
      info = '';
    });
    this.claimform = this.formBuilder.group({
      cswg: new FormControl(['']),
      groceres: new FormControl(['']),
      awi: new FormControl(['']),
      inv_no: new FormControl(['']),
      // auto_gen: new FormControl(['']),
      clm_val: new FormControl(['']),
      query: new FormControl(['']),
    });
    this.callbackForm = this.formBuilder.group({
      name: new FormControl(['']),
      phn_nbr: new FormControl(['']),
      email_id: new FormControl(['']),
      issue: new FormControl(['']),
      tym_callback: new FormControl(['']),
    });
    this.vendorbackForm = this.formBuilder.group({
      name: new FormControl(['']),
    });
    this.payboxForm = this.formBuilder.group({
      name: new FormControl(['']),
    });
    this.salesform = this.formBuilder.group({
      ref_no: new FormControl(['']),
      po_no: new FormControl(['']),
      sel_item: new FormControl(['']),
    });
    this.purchaseform = this.formBuilder.group({
      quot_no: new FormControl(['']),
      item_code: new FormControl(['']),
      pur_item: new FormControl(['']),
    });
    this.enquiryform = this.formBuilder.group({
      cust_no: new FormControl(['']),
      email_id: new FormControl(['']),
      cntc_no: new FormControl(['']),
      query: new FormControl(['']),
    });
    this.genenquiryform = this.formBuilder.group({
      email_id: new FormControl(['']),
      enquiry: new FormControl(['']),
      priority: new FormControl(['']),
    });
    this.salessubform = this.formBuilder.group({
      item_name: ['', Validators.required],
      item_price: ['', Validators.required],
      item_qun: ['', Validators.required],
    });
    this.purcchsubform = this.formBuilder.group({
      item_name_pur: ['', Validators.required],
      item_price_pur: ['', Validators.required],
      item_price_qun: ['', Validators.required],
    });
    this.damageform = this.formBuilder.group({
      damageitem_id: ['', Validators.required],
      damageitem_name: ['', Validators.required],
      damage_description: ['', Validators.required],
    });
    this.returnorderform = this.formBuilder.group({
      returnitem_id: ['', Validators.required],
      returnitem_name: ['', Validators.required],
      Reason: ['', Validators.required],
    });
    this.dealsuiform = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      description: ['', Validators.required],
      phone: ['', Validators.required],
      userid: ['', Validators.required],
      url: ['', Validators.required],
      vendor_broker: ['', Validators.required],
    });
    this.vendorform = this.formBuilder.group({
      vendor_name: ['', Validators.required],
      vendor_point_contact: ['', Validators.required],
      merchantdiser_contact: ['', Validators.required],
    });
    const data = this.general.getData();
  }

  onSubmit(formname: any): any {
    let formValues;
    if (formname === 'claimform') {
      formValues = this.claimform.value;
      this.textval = 'Claim Form';
    } else if (formname === 'salesform') {
      formValues = this.salesform.value;
      this.textval = 'Sales Form';
    } else if (formname === 'purchaseform') {
      formValues = this.purchaseform.value;
      this.textval = 'Item Submission ';
    } else if (formname === 'enquiryform') {
      formValues = this.enquiryform.value;
      this.textval = 'Enquiry Form';
    } else if (formname === 'damageform') {
      formValues = this.damageform.value;
      this.textval = 'Damage Form';
    } else if (formname === 'returnorderform') {
      formValues = this.returnorderform.value;
      this.textval = 'Return Order Form';
    } else if (formname === 'dealsuiform') {
      formValues = this.dealsuiform.value;
      this.textval = 'Deals UI Form';
    } else if (formname === 'vendorform') {
      formValues = this.vendorform.value;
      this.textval = 'Vendor Form';
    } else if (formname === 'genenquiryform') {
      formValues = this.genenquiryform.value;
      this.textval = 'General Enquiry Form';
    } else if (formname === 'callbackform') {
      formValues = this.callbackForm.value;
      this.textval = 'Callback Form';
    } else if (formname === 'vendorbackForm') {
      formValues = this.vendorbackForm.value;
      this.textval = 'Vendor Billback Form';
    } else if (formname === 'payboxForm') {
      formValues = this.payboxForm.value;
      this.textval = 'Paybox Form';
    }
    this.spinner.show();
    const body = { user_selection: formname, entry_form: formValues };

    this.api.onSubmit(body).subscribe(
      (res: any) => {
        this.onSuccesSubmit(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesSubmit(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      Swal.fire({
        icon: 'success',
        text: this.textval + ' Submitted Successfully',
      });
      this.infoval = '';
      this.claimform.reset();
      this.salesform.reset();
      this.enquiryform.reset();
      this.genenquiryform.reset();
      this.purchaseform.reset();
      this.damageform.reset();
      this.returnorderform.reset();
      this.dealsuiform.reset();
      this.vendorform.reset();
    } else {
      this.spinner.hide();
      Swal.fire({
        icon: 'error',
        text: data.msg,
      });
    }
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: error,
    });
  }

  addItem(): any {
    if (this.salessubform.valid) {
      this.sales_items.push(this.salessubform.value);
      this.item_name = '';
      this.item_price = '';
      this.salessubform.reset();
      this.trigger.closeMenu();
    } else {
      return false;
    }
  }
  addItem_pur(): any {
    if (this.purcchsubform.valid) {
      this.purch_items.push(this.purcchsubform.value);

      this.item_name_pur = '';
      this.item_price_pur = '';
      this.purcchsubform.reset();
      this.trigger.closeMenu();
    } else {
      return false;
    }
  }
}
