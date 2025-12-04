import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ConfigService } from '../service/config.service';
import { JsonEditorComponent, JsonEditorOptions } from 'ang-jsoneditor';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GeneralService } from '../../helper/general.service';
import { ErrorService } from '../../helper/error.service';
@Component({
  selector: 'app-configuratios',
  templateUrl: './configuratios.component.html',
  styleUrls: ['./configuratios.component.scss'],
})
export class ConfiguratiosComponent implements OnInit {
  userName: any;
  userRole: any;
  editorOptions = new JsonEditorOptions();
  configData: any;
  showUpdate = false;
  editedConfigData = undefined;
  @ViewChild('editor', { static: true }) editor: JsonEditorComponent | any;
  constructor(
    private gs: GeneralService,
    private cs: ConfigService,
    public spinner: NgxSpinnerService,
    public snack: MatSnackBar,
    private error: ErrorService
  ) {
    //this.userRole = this.gs.getUserRoleData();
    this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
    this.editorOptions.mode = 'tree';
    this.editorOptions.mainMenuBar = true;
    this.editorOptions.navigationBar = true;
    this.editorOptions.statusBar = false;

    this.gs.getUserRoleData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          this.userRole = info;
        } else {
        }
      }
    });
    const data = this.gs.getUserToken();
    this.userName = data[0].user_name;
  }

  ngOnInit(): void {
    this.getConfiguration();
  }
  getConfiguration(): any {
    this.spinner.show();
    const body = { type: 'retrieve' };
    this.cs.getConfiguration(body).subscribe(
      (res: any) => {
        this.onSuccessConfiguration(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessConfiguration(data: any): void {
    this.spinner.hide();
    if (data.res_status === true) {
      this.configData = data.data;
      this.editorOptions.language = 'en';
      this.editorOptions.mode = 'tree';
      this.editorOptions.modes = ['code', 'text', 'tree', 'view'];
      this.editorOptions.statusBar = false;
      this.editorOptions.mainMenuBar = true;
      this.editorOptions.navigationBar = true;
    } else {
      Swal.fire({
        icon: 'error',
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
  updateConfiguration(): any {
    this.spinner.show();
    let body = {};
    if (this.editedConfigData !== undefined) {
      body = { type: 'update', json_data: this.editedConfigData };
    } else {
      body = { type: 'update', json_data: this.configData };
    }
    this.cs.getConfiguration(body).subscribe(
      (res: any) => {
        this.updateSuccessConfiguration(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  updateSuccessConfiguration(data: any): void {
    this.spinner.hide();
    if (data.res_status === true) {
      this.snack.open(data.msg, 'Ok');
      this.getConfiguration();
    }
  }
  changeConfigData($event: any): void {
    this.showUpdate = true;
    this.editedConfigData = $event;
  }
}
