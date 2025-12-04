import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SecurityService } from '../service/security.service';
import { ErrorService } from '../../helper/error.service';
export interface User {
  name: string;
  email: string;
}
@Component({
  selector: 'app-supportgroup',
  templateUrl: './supportgroup.component.html',
  styleUrls: ['./supportgroup.component.scss'],
})
export class SupportgroupComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private ss: SecurityService,
    private error: ErrorService
  ) {}

  userNames: any[] = [];
  domainDetails: any[] = [];
  domain: any;
  userNameControl = new FormControl();
  filteredOptions: Observable<User[]> | any;
  domainNameControl = new FormControl();
  subDomainNameControl = new FormControl();
  filteredDomainOptions: Observable<User[]> | any;
  filteredSubDomainOptions: Observable<any[]> | any;
  subDomainDetails = [];
  domainData = [];
  ngOnInit(): void {
    this.ss.getAllUserData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.userNames = info;
      }
    });
    this.ss.getDomainData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.domainData = info;
        info.map((item: any) => {
          this.domainDetails.push({ name: item.domain });
        });
        this.domainDetails.push({ name: 'General' });
      }
    });

    this.filteredOptions = this.userNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.userNames.slice()))
    );
    this.filteredDomainOptions = this.domainNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) =>
        name ? this.domainFilter(name) : this.domainDetails.slice()
      )
    );
    this.filteredSubDomainOptions = this.subDomainNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value)),
      map((name) =>
        name ? this.subDomainFilter(name) : this.subDomainDetails.slice()
      )
    );
  }

  onDomainSelectionChange(event: any): any {
    console.log(event.option);
    let subDomainData: any = this.domainData.find(
      (item: any) => item.domain === event.option.value.name
    );
    this.subDomainDetails = subDomainData ? subDomainData.sub_domain : [];
    this.subDomainNameControl.reset();
  }
  addSupport(): any {
    const body = {
      support_type: 'insert',
      json_data: {
        name: this.userNameControl.value.name,
        email: this.userNameControl.value.email,
        domain: this.domainNameControl.value.name,
        sub_domain: this.subDomainNameControl.value,
      },
    };
    console.log(body);

    this.ss.support(body).subscribe(
      (res: any) => {
        this.onSuccessSupport(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessSupport(data: any): any {
    if (data.res_status === true) {
      this.userNameControl.patchValue('');
      this.domainNameControl.patchValue('');
      Swal.fire({
        icon: 'success',
        text: data.msg,
      });
    } else {
      Swal.fire({
        icon: 'success',
        text: this.error.handleError(data),
      });
    }
  }
  displayFn(user: User): string {
    return user && user.name ? user.name : '';
  }
  displaysubFn(user: any): string {
    return user ? user : '';
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.userNames.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private domainFilter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.domainDetails.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private subDomainFilter(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.subDomainDetails.filter((option: any) =>
      option.toLowerCase().includes(filterValue)
    );
  }

  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
}
