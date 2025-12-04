import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SecurityService } from '../service/security.service';
import { GeneralService } from '../../helper/general.service';
import { ErrorService } from '../../helper/error.service';

export interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  constructor(
    private spinner: NgxSpinnerService,
    private gs: GeneralService,
    private ss: SecurityService,
    private error: ErrorService
  ) {}
  roleName: any;
  userName: any;
  userNames: any[] = [];
  userRole: any;
  Roles: any[] = [];
  userNameControl = new FormControl();
  filteredOptions: Observable<User[]> | any;
  ngOnInit(): void {
    this.ss.getAllUserData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.userNames = info;
      }
    });
    this.gs.getUserRoleData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          this.userRole = info;
        } else {
        }
      }
    });

    if (this.userRole === 'global_admin') {
      this.Roles = [
        { name: 'Global Configurator', value: 'global_configurator' },
        { name: 'Domain Admin', value: 'domain_admin' },
        { name: 'Domain Configurator', value: 'domain_configurator' },
        { name: 'End User', value: 'enduser' },
      ];
    } else if (this.userRole === 'global_configurator') {
      this.Roles = [
        { name: 'Domain Admin', value: 'domain_admin' },
        { name: 'Domain Configurator', value: 'domain_configurator' },
        { name: 'End User', value: 'enduser' },
      ];
    } else if (this.userRole === 'domain_admin') {
      this.Roles = [
        { name: 'Domain Configurator', value: 'domain_configurator' },
        { name: 'End User', value: 'enduser' },
      ];
    } else if (this.userRole === 'domain_configurator') {
      this.Roles = [{ name: 'End User', value: 'enduser' }];
    }

    this.filteredOptions = this.userNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.userNames.slice()))
    );
  }

  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  addRole(): any {
    this.spinner.show();
    const body = {
      user_roles_type: 'insert',
      json_data: {
        name: this.userNameControl.value.name,
        email: this.userNameControl.value.email,
        role: this.roleName,
      },
    };
    this.ss.roles(body).subscribe(
      (res) => {
        this.onSuccessRoles(res);
      },
      (err) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessRoles(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.userNameControl.patchValue('');
      this.roleName = '';
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

  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.userNames.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
}
