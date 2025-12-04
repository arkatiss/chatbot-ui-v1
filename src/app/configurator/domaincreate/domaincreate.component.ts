import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ConfigService } from '../service/config.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonService } from '../../helper/common.service';
@Component({
  selector: 'app-domaincreate',
  templateUrl: './domaincreate.component.html',
  styleUrls: ['./domaincreate.component.scss'],
})
export class DomaincreateComponent implements OnInit {
  domainForm: FormGroup | any;
  domaintrue = false;
  subdomaintrue = false;
  domainDetailsValues = [];
  domainVal: any;
  domains: any[] = [];
  shownewDomain = true;
  filteredDomainOptions: Observable<string[]> | any;
  domainsubdomain: any;
  constructor(
    private fb: FormBuilder,
    private common: CommonService,
    public snack: MatSnackBar,
    private spinner: NgxSpinnerService,
    private cs: ConfigService
  ) {
    this.domainForm = this.fb.group({
      domain_val: ['', Validators.required],
      sub_domain_val: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.retrieveDomain();
  }
  addnewDomain(): void {
    this.shownewDomain = !this.shownewDomain;
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
  filter(val: string | any): string[] {
    const filterValue = val.toLowerCase();
    return this.domains.filter((option) =>
      option.domain.toLowerCase().includes(filterValue)
    );
  }
  onSuccesssRetDomain(datas: any): any {
    this.spinner.hide();
    if (datas.res_status === true) {
      console.log(datas.data);
      this.domains = datas.data;
      this.filteredDomainOptions =
        this.domainForm.controls.domain_val.valueChanges.pipe(
          startWith(''),
          map((val) => this.filter(val))
        );
    } else {
    }
  }
  radioChange(evt: any): void {
    if (evt === 'domain') {
      this.domaintrue = true;
      this.subdomaintrue = false;
    } else if (evt === 'sub_domain') {
      this.subdomaintrue = true;
      this.domaintrue = false;
    }
  }
  addmaindomain(val: any): any {
    this.domaintrue = !this.domaintrue;
    this.subdomaintrue = true;
    this.domainsubdomain = val;
  }
  addDomain(): any {
    this.spinner.show();
    const body = {
      domain: this.domainForm.get('domain_val').value,
      sub_domain: this.domainForm.get('sub_domain_val').value,
      chat_bot_type: 'save',
    };
    this.cs.addDomain(body).subscribe(
      (res: any) => {
        this.onSuccesssDomain(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesssDomain(datas: any): any {
    if (datas.res_status === true) {
      this.domainForm.reset();
      this.spinner.hide();
      this.snack.open(datas.msg, 'Ok');
    } else {
      this.snack.open(datas.msg, 'Ok');
    }
  }
  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: error,
    });
  }
  cancel(): any {
    this.spinner.hide();
    this.common.http.cancelCall();
  }
  displayFn(option: any): string {
    if (!option) return '';
    return option.fileName || option.domain || option;
  }
}
