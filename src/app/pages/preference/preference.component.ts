import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { ApicallService } from '../apiservice/apicall.service';
@Component({
  selector: 'app-preference',
  templateUrl: './preference.component.html',
  styleUrls: ['./preference.component.scss'],
})
export class PreferenceComponent implements OnInit {
  Form: FormGroup | any;
  personalForm: FormGroup | any;
  botsetupForm: FormGroup | any;
  selectedType: any;
  selectedParamsValue: any[] = [];
  selectedChainType: any;
  selectedChainParamsValue: any;
  selectedStrGrpType: any;
  selectedStrGrpParamsValue: any;
  selectedStrType: any;
  selectedStrParamsValue: any;
  sales = ['services', 'sales'];
  regions = [
    { name: 'North East', val: 'north east' },
    { name: 'West Coast', val: 'west coast' },
    { name: 'Mid west', val: 'mid west' },
  ];
  genders = [
    { name: 'Male', val: 'male' },
    { name: 'Female', val: 'female' },
  ];
  retentions = [
    { name: '3 months', val: '3months' },
    { name: '6 months', val: '6months' },
    { name: '9 months', val: '9months' },
    { name: '12 months', val: '12months' },
  ];
  privatechats = [
    { name: 'Enable', val: 'enable' },
    { name: 'Disable', val: 'disable' },
  ];
  sessionId: any;
  userName: any;
  domainDetails: any[] = [];
  subDomainDetails: any;
  infydomain: any;
  subinfydomain: any;
  preferanceId: any;
  organizations: any[] = [
    { name: 'CSWG', val: 'cswg' },
    { name: 'AWI', val: 'awi' },
    { name: 'GCS', val: 'gcs' },
  ];
  chainData: any[] = [];
  storeData: any[] = [];
  chainStoreData: any[] = [];
  strNumber: any;
  constructor(
    private formBuilder: FormBuilder,
    private snack: MatSnackBar,
    private api: ApicallService
  ) {}

  ngOnInit(): void {
    this.Form = this.formBuilder.group({
      organization: new FormControl(['']),
      designation: new FormControl(['']),
      infydomain: new FormControl(['']),
      subinfydomain: new FormControl(['']),
      chainnbr: new FormControl(['']),
      storenbr: new FormControl(['']),
    });
    this.personalForm = this.formBuilder.group({
      name: new FormControl(['']),
      phn: new FormControl(['']),
      rc_id: new FormControl(['']),
      email: new FormControl(['']),
    });
    this.botsetupForm = this.formBuilder.group({
      retention_period: new FormControl(['']),
      private_chat_only: new FormControl(['']),
    });

    this.retrieveDomain();
    this.getChainsData();
  }

  onErrorr(error: any): any {
    // this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: error,
    });
  }
  getChainsData(): any {
    const body = {};
    this.api.getChainData(body).subscribe(
      (res: any) => {
        this.onSuccesChainData(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesChainData(data: any): any {
    if (data.res_status === true) {
      this.chainStoreData = data.data;
      const chainArray: any[] = [];
      this.chainStoreData.map((item: any) => {
        chainArray.push(item.chain_nbr);
      });
      this.chainData = [...new Set(chainArray)];
      this.getUserData();
    }
  }
  selectStoreNbr(value: any): any {
    this.storeData = [];
    this.chainStoreData.map((item: any) => {
      if (item.chain_nbr === value) {
        this.storeData.push(item.store_nbr);
      }
    });
    this.Form.patchValue({
      storenbr: this.strNumber,
    });
  }
  getUserData(): any {
    const body = { preference_type: 'retrieve' };
    this.api.getUserData(body).subscribe(
      (res: any) => {
        this.onSuccesuserData(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }

  onSuccesuserData(data: any): any {
    if (data.res_status === true) {
      this.selectDomainForInfoset(data.data.org_setup.infydomain);
      this.preferanceId = data.data.preference_id;
      this.Form.patchValue({
        infydomain: data.data.org_setup.infydomain,
        subinfydomain: data.data.org_setup.subinfydomain[0],
        organization: data.data.org_setup.organization,
        designation: data.data.org_setup.designation,
        chainnbr: data.data.org_setup.chainnbr,
      });
      (this.strNumber = data.data.org_setup.storenbr),
        this.selectStoreNbr(data.data.org_setup.chainnbr);
      this.personalForm.patchValue({
        name: data.data.personal_setup.name,
        email: data.data.personal_setup.email,
        phn: data.data.personal_setup.phn,
        rc_id: data.data.personal_setup.rc_id,
      });
      this.botsetupForm.patchValue({
        private_chat_only: data.data.bot_setup.name,
        retention_period: data.data.bot_setup.retention_period,
      });
    } else {
      this.snack.open(data.msg, 'Ok');
    }
  }

  moveToSelectedTab(tabName: string): void {
    for (
      let i = 0;
      i < document.querySelectorAll('.mat-tab-label-content').length;
      i++
    ) {
      if (
        (document.querySelectorAll('.mat-tab-label-content')[i] as HTMLElement)
          .innerText === tabName
      ) {
        (document.querySelectorAll('.mat-tab-label')[i] as HTMLElement).click();
      }
    }
  }

  retrieveDomain(): any {
    const body = { chat_bot_type: 'retrieve' };
    this.api.retrieveDomain(body).subscribe(
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
      if (element.domain === val) {
        this.subDomainDetails = element.sub_domain;
      }
    });
  }
  dataSubmit(): any {
    let body = {};
    if (
      this.preferanceId !== undefined &&
      this.preferanceId !== null &&
      this.preferanceId !== ''
    ) {
      body = {
        preference_type: 'update',
        org_setup: this.Form.value,
        personal_setup: this.personalForm.value,
        bot_setup: this.botsetupForm.value,
        preference_id: this.preferanceId,
      };
    } else {
      body = {
        preference_type: 'insert',
        org_setup: this.Form.value,
        personal_setup: this.personalForm.value,
        bot_setup: this.botsetupForm.value,
      };
    }
    this.api.getUserData(body).subscribe(
      (res: any) => {
        this.onSuccesubmit(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesubmit(data: any): any {
    if (data.res_status === true) {
      this.snack.open(data.msg, 'Ok');
    } else {
      this.snack.open(data.msg, 'Ok');
    }
  }
}
