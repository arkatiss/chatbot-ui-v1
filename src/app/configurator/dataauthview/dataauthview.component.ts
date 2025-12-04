import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ConfigService } from '../service/config.service';
import { CommonService } from '../../helper/common.service';
import { ErrorService } from '../../helper/error.service';

@Component({
  selector: 'app-dataauthview',
  templateUrl: './dataauthview.component.html',
  styleUrls: ['./dataauthview.component.scss'],
})
export class DataauthviewComponent implements OnInit {
  AdminDetails: any[] = [];
  editValues: any;
  chainsDataDynamicUpdate: Array<Record<string, any>> = [];
  selectedBoxes: any;
  toppingList: any[] = [];
  selectBoxes2 = new FormControl();
  toppings = new FormControl();
  infosetId: any;
  authId: any;
  authUserName: any;
  UpdateDynamicArray: any[] = [];
  updateAdminForm: FormGroup;

  constructor(
    private spinner: NgxSpinnerService,
    private common: CommonService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private cs: ConfigService,
    private error: ErrorService
  ) {
    this.updateAdminForm = this.fb.group({
      userName: [''],
      infoset: [''],
      auth_id: [''],
      selectBoxes: [''],
    });
  }
  ngOnInit(): void {
    this.retrieveAdmin();
  }
  retrieveAdmin(): any {
    const body = { chat_bot_admin_type: 'retrieve' };
    this.cs.AddAdminData(body).subscribe(
      (res: any) => {
        this.onSuccesssRetAdminData(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssRetAdminData(data: any): any {
    if (data.res_status === true) {
      this.AdminDetails = data.data;
    } else {
      Swal.fire({
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

  editAdminData(editAdminDataVal: TemplateRef<any>, editValues: any): any {
    this.editValues = editValues;
    this.chainsDataDynamicUpdate = editValues.info_data;
    for (const a of this.chainsDataDynamicUpdate) {
      const obj: any = Object.values(a);
      this.selectedBoxes = obj;
      this.toppingList = [obj];
      this.selectBoxes2.setValue(this.selectedBoxes);
      this.toppings.setValue([obj]);
    }
    this.infosetId = editValues.infoset_id;
    this.authId = editValues.auth_id;
    this.authUserName = editValues.auth_user_name;
    this.dialog.open(editAdminDataVal, {
      width: '1000px',
      maxHeight: 'calc(100vh - 60px)',
    });
  }

  updateAdmin(): any {
    const dataVal = JSON.stringify(this.UpdateDynamicArray);
    const json = {
      auth_id: this.authId,
      infoset_id: this.infosetId,
      auth_user_name: this.authUserName,
      info_data: dataVal,
    };
    const body = { chat_bot_admin_type: 'update', json_data: json };
    this.cs.AddAdminData(body).subscribe(
      (res: any) => {
        this.onSuccesssUpdateAdmin(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssUpdateAdmin(data: any): any {
    if (data.res_status === true) {
      this.retrieveAdmin();
      this.dialog.closeAll();
      this.updateAdminForm.reset();
      Swal.fire({
        icon: 'success',
        text: this.error.handleError(data),
      });
    }
  }
  closedialog(): any {
    this.dialog.closeAll();
  }
  adminDelete(row: any) {}
  ChainSelectionUpdate(event: any, chidx: any, key: any) {}
}
