import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormArray,
  FormBuilder,
  FormGroupDirective,
} from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
import { ConfigService } from '../service/config.service';
import { CommonService } from '../../helper/common.service';
import { ErrorService } from '../../helper/error.service';

interface Infoset {
  infoset: string;
}
@Component({
  selector: 'app-dataauthcreate',
  templateUrl: './dataauthcreate.component.html',
  styleUrls: ['./dataauthcreate.component.scss'],
})
export class DataauthcreateComponent implements OnInit {
  sqluserform: FormGroup | any;
  // infosetData: any[] = [];
  infosetData: Infoset[] = [];
  chainsDataDynamic: Array<Record<string, any>> = [];
  submitbtn = false;
  selectBoxes: any[] = [];
  userNames: any;
  dynamicArray: any[] = [];
  UpdateDynamicArray: any[] = [];

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    public snack: MatSnackBar,
    private common: CommonService,
    private http: HttpClient,
    private cs: ConfigService,
    private error: ErrorService
  ) {
    this.sqluserform = this.fb.group({
      sqlUser: this.fb.array([]),
      domain_details: new FormControl(['']),
    });
    this.sqlUser.push(
      this.fb.group({
        userName: '',
        infoset: '',
        selectBoxes: '',
        strGrp: '',
        str: '',
      })
    );
  }

  ngOnInit(): void {
    this.getUserNames();
  }
  get sqlUser(): any {
    return this.sqluserform.get('sqlUser') as FormArray;
  }
  getInfosetData(authUserName: any): any {
    const body = { auth_user_name: authUserName };
    this.cs.getInfosetData(body).subscribe(
      (res: any) => {
        this.onSuccesssInfoset(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssInfoset(data: any): any {
    if (data.res_status === true) {
      this.infosetData = [];
      for (const g of data.data) {
        const abc = g.infoset.split('.');
        const obj = { infoset_id: g.infoset_id, infoset: abc[0] };
        this.infosetData.push(obj);
      }
    }
  }
  ChainSelection(
    value: any,
    parentIndex: any,
    childIndex: any,
    abcd: any
  ): any {
    this.dynamicArray[childIndex] = { [abcd]: value };
  }
  ChainSelectionUpdate(value: any, childIndex: any, abcd: any): any {
    this.UpdateDynamicArray[childIndex] = { [abcd]: value };
  }
  changeInfoset(sqlform: any, index: any): any {
    const InfosetId = sqlform.value.sqlUser[index].infoset.infoset_id;
    const Infoset = sqlform.value.sqlUser[index].infoset.infoset;
    const body = { infoset_id: InfosetId, file: Infoset + '.yml' };
    this.cs.changeInfoset(body).subscribe(
      (res: any) => {
        this.onSuccesssInfosetChange(index, res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssInfosetChange(index: any, data: any): any {
    if (data.res_status === true) {
      this.submitbtn = true;
      const newData: any = data.data;
      const abcd: any[] = [];
      const filtered = newData.filter((e: any) => e);
      for (const col of filtered) {
        const ab = col.column.split('&&');
        const a = JSON.parse(ab[1]);
        this.chainsDataDynamic = [];
        this.selectBoxes.push(ab[0]);
        const chainsDataDynamic: any[] = [];
        this.selectBoxes.map((subItem: any) => {
          if (subItem !== 0) {
            filtered.map((item: any) => {
              const ab = item.column.split('&&');
              const a = JSON.parse(ab[1]);
              if (subItem === ab[0]) {
                if (a[0] === 'NA') {
                  const Url = item.operation.split('&&');
                  const apiUrl = Url;
                  if (apiUrl[0] === 'api') {
                    const body = item.payload;
                    this.http.post<any>(apiUrl[1], body).subscribe((resp) => {
                      if (resp.res_status === true) {
                        const respObject = resp.data.slice(0, 10);
                        const respValues: any[] = [];
                        respObject.map((itm: any) => {
                          respValues.push(Object.values(itm));
                        });

                        // this.chainsDataDynamic.push(respValues);
                        chainsDataDynamic.push({ [subItem]: respValues });
                      } else {
                      }
                    });
                  }
                } else {
                  chainsDataDynamic.push({ [subItem]: a });
                }
                this.chainsDataDynamic = chainsDataDynamic;
              }
            });
            // for (const a of chainsDataDynamic) {

            // }
            const obj = { name: [subItem], data: chainsDataDynamic };
            abcd.push(obj);
          }
        });
      }
    }
  }
  getUserNames(): any {
    const body = {};
    this.cs.getUserNames(body).subscribe(
      (res: any) => {
        this.onSuccesssGetUsers(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssGetUsers(data: any): any {
    if (data.res_status === true) {
      this.userNames = data.data;
      this.userNames = this.getUnique(this.userNames, 'user_name');
    }
  }
  getUnique(arr: any, comp: any): any {
    const unique = arr
      .map((e: any) => e[comp])
      .map((e: any, i: any, final: any) => final.indexOf(e) === i && i)
      .filter((e: any) => arr[e])
      .map((e: any) => arr[e]);
    return unique;
  }
  AddAdminData(s: any, formDirective: FormGroupDirective | any, b: any): any {
    const json = [];
    const user = s.sqlUser[0].userName;
    let body;
    const dataVal = JSON.stringify(this.dynamicArray);
    for (const a of s.sqlUser) {
      json.push({
        infoset_id: a.infoset.infoset_id,
        auth_user_name: user,
        info_data: dataVal,
      });
      body = { chat_bot_admin_type: 'insert', json_data: json };
    }
    this.cs.AddAdminData(body).subscribe(
      (res: any) => {
        this.onSuccesssAdminData(formDirective, res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssAdminData(formDirective: any, data: any): any {
    if (data.res_status === true) {
      formDirective.resetForm();
      this.sqluserform.reset();
      Swal.fire({
        icon: 'success',
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
  cancel(): any {
    this.spinner.hide();
    this.common.http.cancelCall();
  }
}
