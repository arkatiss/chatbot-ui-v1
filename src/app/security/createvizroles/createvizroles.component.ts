import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { SecurityService } from '../service/security.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorService } from '../../helper/error.service';
export interface User {
  name: string;
  email: string;
}

@Component({
  selector: 'app-createvizroles',
  templateUrl: './createvizroles.component.html',
  styleUrls: ['./createvizroles.component.scss'],
})
export class CreatevizrolesComponent implements OnInit {
  constructor(
    private ss: SecurityService,
    public spinner: NgxSpinnerService,
    private error: ErrorService,
    private snack: MatSnackBar
  ) {}
  userNameControl = new FormControl();
  appsControl = new FormControl();
  permissionControl = new FormControl();
  filteredOptions: Observable<User[]> | any;
  userNames: any[] = [];
  appList: string[] = [];
  appListView: string[] = ['All', 'View'];
  selectedApps = this.appList;
  selectedAppsView = this.appListView;
  allSelected = false;
  allSelectedViews = false;
  selectall = 'Select All';
  selectallViews = 'Select All';
  @ViewChild('select') select: MatSelect | any;
  @ViewChild('selectview') selectView: MatSelect | any;
  email: any;
  ngOnInit(): void {
    this.ss.getAllUserData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        this.userNames = info;
      }
    });

    this.filteredOptions = this.userNameControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => (name ? this._filter(name) : this.userNames.slice()))
    );
    this.getAppNames();
  }
  private _filter(name: string): User[] {
    const filterValue = name.toLowerCase();

    return this.userNames.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }
  getAppNames(): void {
    this.ss.getAppNames().subscribe(
      (res: any) => {
        this.onSuccessAppNames(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessAppNames(data: any): void {
    if (data.res_status === true) {
      this.appList = data.data;
      this.selectedApps = this.appList;
    } else {
      Swal.fire({
        icon: 'error',
        text: this.error.handleError(data),
      });
    }
  }
  onSearchAppList(value: any): void {
    const val: any = value.target.value;
    this.selectedApps = this.searchAppList(val);
  }
  onSearchAppListView(value: any): void {
    this.selectedApps = this.searchAppListView(value);
  }
  searchAppListView(value: string): any {
    const filter = value.toLowerCase();
    return this.appListView.filter((option) =>
      option.toLowerCase().startsWith(filter)
    );
  }
  searchAppList(value: string): any {
    const filter = value.toLowerCase();
    return this.appList.filter((option) =>
      option.toLowerCase().startsWith(filter)
    );
  }
  toggleAllSelection(): void {
    if (this.allSelected) {
      this.selectall = 'Deselect All';
      this.select.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectall = 'Select All';
      this.select.options.forEach((item: MatOption) => item.deselect());
    }
  }
  toggleAllSelectionViews(): void {
    if (this.allSelectedViews) {
      this.selectallViews = 'Deselect All';
      this.selectView.options.forEach((item: MatOption) => item.select());
    } else {
      this.selectallViews = 'Select All';
      this.selectView.options.forEach((item: MatOption) => item.deselect());
    }
  }
  changeApps(): void {
    let newStatus = true;
    this.select.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }
  changeViews(): void {
    let newStatus = true;
    this.selectView.options.forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelectedViews = newStatus;
  }

  onErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: this.error.handleError(error),
    });
  }
  selectUser(val: any): void {
    this.email = '';
    this.email = val;
  }

  addRole(): void {
    this.spinner.show();
    const body = {
      app_viz_type: 'insert',
      email: this.userNameControl.value,
      appname: this.appsControl.value,
      permissions: [this.permissionControl.value],
    };
    this.ss.vizroles(body).subscribe(
      (res: any) => {
        this.onSuccessInsertRoles(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessInsertRoles(data: any): void {
    this.snack.open(data.msg, 'Ok');
    this.spinner.hide();
    if (data.res_status === true) {
      this.userNameControl.setValue('');
      this.appsControl.setValue('');
      this.permissionControl.setValue('');
      this.allSelected = false;
      this.allSelectedViews = false;
    } else {
      this.userNameControl.setValue('');
      this.permissionControl.setValue('');
      this.allSelected = false;
      this.allSelectedViews = false;
      this.error.handleError(data);
    }
  }
  displayFn(option: any): string {
    if (!option) return '';
    return option.name;
  }
}
