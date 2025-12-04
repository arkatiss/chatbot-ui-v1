import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SecurityService } from '../service/security.service';
import { ErrorService } from '../../helper/error.service';
export interface User {
  name: string;
  email: string;
}
@Component({
  selector: 'app-maping',
  templateUrl: './maping.component.html',
  styleUrls: ['./maping.component.scss'],
})
export class MapingComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private ss: SecurityService,
    private error: ErrorService
  ) {}
  userNames: any[] = [];
  domainDetails: any[] = [];
  subDomainDetails: any[] = [];
  domain: any;
  subDomain: any;
  userName: any;
  userNameControl = new FormControl();
  filteredOptions: Observable<User[]> | any;
  domainNameControl = new FormControl();
  filteredDomainOptions: Observable<User[]> | any;
  subDomainNameControl = new FormControl();
  filteredSuDomainOptions: Observable<User[]> | any;

  ngOnInit(): void {
    this.ss.getAllUserData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        info.map((item: any) => {
          if (item.name) {
            this.userNames.push(item);
          }
        });
      }
    });
    this.ss.getDomainData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.domainDetails = info;
      }
    });

    this.filteredOptions = this.userNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.userNames.slice()))
    );
    this.filteredDomainOptions = this.domainNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.domain)),
      map((name) =>
        name ? this.domainFilter(name) : this.domainDetails.slice()
      )
    );

    this.filteredSuDomainOptions = this.subDomainNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.domain)),
      map((name) =>
        name ? this.subdomainFilter(name) : this.subDomainDetails.slice()
      )
    );
  }
  selectDomainForMaping(val: any): any {
    this.subDomainNameControl.setValue('');
    this.domainDetails.forEach((element) => {
      if (element.domain === val) {
        this.subDomainDetails = element.sub_domain;
        this.filteredSuDomainOptions =
          this.subDomainNameControl.valueChanges.pipe(
            startWith(''),
            map((value) => (typeof value === 'string' ? value : value.domain)),
            map((name) =>
              name ? this.subdomainFilter(name) : this.subDomainDetails.slice()
            )
          );
      }
    });
  }
  addMaping(): any {
    this.spinner.show();

    const body = {
      map_type: 'insert',
      json_data: {
        user_name: this.getUserEmail(),
        domain: this.domainNameControl.value,
        sub_domain: this.subDomainNameControl.value,
      },
    };

    this.ss.maping(body).subscribe(
      (res) => {
        this.onSuccessMaping(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  getUserEmail() {
    let userEmail: any;
    this.userNames.map((item) => {
      if (item?.name === this.userNameControl.value) {
        userEmail = item.email;
      }
    });
    return userEmail.split('@')[0];
  }
  onSuccessMaping(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.userNameControl.patchValue('');
      this.domainNameControl.patchValue('');
      this.subDomainNameControl.patchValue('');

      Swal.fire({
        icon: 'success',
        text: data.msg,
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

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.userNames.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  private domainFilter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.domainDetails.filter((option) =>
      option?.domain.toLowerCase().includes(filterValue)
    );
  }
  private subdomainFilter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.subDomainDetails.filter((option) =>
      option?.toLowerCase().includes(filterValue)
    );
  }
  displayFn(option: any): string {
    if (!option) return '';
    return option.name || option.domain || option;
  }
}
