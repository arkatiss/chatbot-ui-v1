import { MatSnackBar } from '@angular/material/snack-bar';

import { NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ApicallService } from '../../apiservice/apicall.service';
import Swal from 'sweetalert2';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { GeneralService } from '../../../helper/general.service';

@Component({
  selector: 'app-dynamicforms',
  templateUrl: './dynamicforms.component.html',
  styleUrls: ['./dynamicforms.component.scss'],
})
export class DynamicformsComponent implements OnInit {
  constructor(
    private general: GeneralService,
    private api: ApicallService,
    private spinner: NgxSpinnerService,
    private snack: MatSnackBar,
    private changeDetection: ChangeDetectorRef
  ) {}
  dynamicFields: any[] = [];
  formName: any;
  finalFields: any[] = [];
  userName: any;
  sessionId: any;
  loginFullName: any;
  chainNbr: any;
  storeNbr: any;
  chainStoreData: any[] = [];
  chainData: any[] = [];
  storeData: any[] = [];
  formData: any;
  getUrl: any;
  connector: any;
  tableName: any;
  createFields: any[] = [];
  formUrl: any;
  createUrl: any;
  queList: any[] = [];
  submitUrl: any;
  ticketStatus = false;
  defaultArray: any[] = [];
  actionBtns: any[] = [];
  childAppname: any;
  appType: any;
  defaultUserData: any;
  timerId: any;
  cascadeObj: any = {};
  payLoadData = '';
  passingValue = '';
  replaceName = '';
  reqData: any;
  uploadedLogo: any;
  filters: any[] = [];
  filters2: any[] = [];
  @ViewChild('autosize', { static: false }) autosize: CdkTextareaAutosize | any;
  ngOnInit(): void {
    const data = this.general.getUserToken();
    this.userName = data[0].user_name;
    this.sessionId = data[0].session_id;

    this.general.getDynamicFormsData().subscribe((info: any) => {
      if (info !== undefined && info !== null) {
        if (Object.keys(info).length > 0) {
          console.log(info);
          this.dynamicFields = [];
          this.formName = '';
          this.getUrl = info?.getUrl;
          this.dynamicFields = info.forms;
          this.formName = info.intent;
          this.formData = info.formData;
          this.submitUrl = info.submiturl;
        }
      }
      this.getFormData();
      // if (this.formName.toLowerCase() === 'helpdesk'){
      //   this.getFormData();
      // } else {
      //   this.finalFields = [];

      //   this.dynamicFields.map((item) => {
      //     this.finalFields.push({name : item, value: '', values: []});
      //   });
      //   const objs = {};
      //   this.dynamicFields.map((item, i) => {
      //     objs[this.dynamicFields[i]] = '';
      //   });
      // }

      if (
        data[0].name === '' ||
        data[0].name === undefined ||
        data[0].name === null
      ) {
        this.loginFullName = data[0].user_name.split('@')[0];
      } else {
        this.loginFullName = data[0].name;
      }
    });

    this.getChainsData();
  }
  getFormData(): any {
    this.spinner.show();

    this.ticketStatus = false;
    this.api.getAppData(this.getUrl).subscribe(
      (res: any) => {
        this.onSucceshelpdesk(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSucceshelpdesk(data: any): any {
    this.spinner.hide();
    if (data.res_status === true) {
      this.connector = data.data.connector_name;
      this.tableName = data.data.tbl_name;
      const screenData = data.data.screens_data;
      this.appType = data.data.app_type;

      const defaultUsers = this.getUrl.split('?');

      this.actionBtns = [];
      if (
        data.data.action !== undefined &&
        data.data.action !== null &&
        data.data.action.length !== 0
      ) {
        this.actionBtns = data.data.action;
      }
      this.filters = [];
      if (data.data.filters) {
        this.filters = data.data.filters;
        this.filters2 = data.data.filters;
        this.filters.map((item) => {
          if (!('type' in item)) {
            Object.assign(item, { type: 'string' });
          }
        });
      }
      this.finalFields = [];
      let createFields: any[] = [];
      this.createFields = [];
      //let refUrl;
      screenData.map((item: any) => {
        if (item.screen_name.toLowerCase() === 'create') {
          //this.finalFields = item.screen_data.fields;
          this.formUrl = item.screen_data.buttons[0].url;

          // if (item.screen_data.ref_url !== undefined && item.screen_data.ref_url !== null) {
          //   refUrl = item.screen_data.ref_url;
          //   this.getQueData(item.screen_data.ref_url);
          // }
          this.createUrl = item.screen_data.buttons[0].url;
          createFields = item.screen_data.fields;
        }
      });
      // this.formData.map((test) => {
      //   this.finalFields.map((item) => {
      //     if (item.values !== undefined) {
      //       if (item.values.length > 0) {
      //         Object.assign(item, {values: item.values, value: test[item.name]});
      //       } else {
      //         Object.assign(item, {value: test[item.name], values: []});
      //       }
      //     } else {
      //       Object.assign(item, {value: test[item.name], values: []});
      //     }
      //   });
      // });

      createFields.map((item) => {
        if (
          item.create === true &&
          item.create !== undefined &&
          item.create !== null
        ) {
          item.values !== undefined
            ? Object.assign(item, {
                values:
                  item.values.length > 0
                    ? item.sort === false
                      ? item.values
                      : item.values.sort()
                    : [],
                value: '',
              })
            : item.url !== undefined &&
              item.url !== null &&
              (item.cascading === undefined ||
                item.cascading === null ||
                item.cascading === '')
            ? this.getQueData(item.url, item.name)
            : Object.assign(item, {
                value: item.default_value ? item.default_value : '',
                values: [],
              });
          item.field_length
            ? Object.assign(item, { field_length: item.field_length })
            : Object.assign(item, { field_length: 250 });
          this.createFields.push(item);
        }
      });
      this.childAppname = data?.data?.child_appl?.name;
      if (this.childAppname) {
        this.runDefaultApp(
          defaultUsers[0].trimEnd() + '?' + this.childAppname.trimStart()
        );
      } else {
        this.finalFields = this.createFields;
      }

      if (this.formData) {
        [this.formData].map((test) => {
          this.finalFields.map((item) => {
            if (item.values !== undefined) {
              if (item.values.length > 0) {
                Object.assign(item, {
                  values: item.values,
                  value: test[item.name.toLowerCase()],
                });
              } else {
                Object.assign(item, {
                  value: test[item.name.toLowerCase()],
                  values: [],
                });
              }
            } else {
              Object.assign(item, { value: test[item.name], values: [] });
            }
          });
        });
      }

      this.changeDetection.detectChanges();
    }
  }
  runDefaultApp(appname: any): void {
    this.api.getAppData(appname).subscribe(
      (res: any) => {
        this.onSuccessRunDefaultApp(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessRunDefaultApp(res: any): void {
    if (res.res_status === true) {
      const connector = res.data.connector_name;
      const tableName = res.data.tbl_name;
      const screenData = res.data.screens_data;
      let retrieveUrl = '';
      screenData.map((item: any) => {
        if (item.screen_name.toLowerCase() === 'view') {
          retrieveUrl = item.screen_data.buttons[0].url;
        }
      });

      this.getDefaultGridData(connector, tableName, retrieveUrl);
    }
  }
  getDefaultGridData(connector: any, tableName: any, retrieveUrl: any) {
    const body = {
      tbl_name: tableName,
      connector_name: connector,
      op_type: 'retrieve',
      user_name: this.userName,
      name: this.userName.split('@')[0],
      url: retrieveUrl,
      filter_string: "email = '" + this.userName + "'",
    };

    this.api.createAutoTask(this.submitUrl, body).subscribe(
      (res: any) => {
        this.onSuccesDefaultsGridData(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccesDefaultsGridData(res: any): void {
    if (res.res_status === true) {
      if (res.data[0].TICKET_CREATE === 'Y') {
        this.ticketStatus = true;
      }
      const formData = res.data[0];
      const headerNames = Object.keys(res.data[0]);
      this.defaultUserData = res.data[0];
      const ticketStatusForm: any[] = [];
      [formData].map((item) => {
        headerNames.map((test) => {
          const obj = { name: test, value: item[test] };
          ticketStatusForm.push(obj);
        });
      });
      this.defaultArray = [];
      this.defaultArray = ticketStatusForm;
      this.defaultDataPopulate();
    } else {
      this.ticketStatus = false;
    }
  }
  defaultDataPopulate(): any {
    this.createFields.map((item) => {
      if (this.defaultArray.length !== 0) {
        this.defaultArray.map((test) => {
          if (item.name === test.name) {
            Object.assign(item, {
              value: test.value ? test.value : item.default_value,
            });
          }
          if (item.cascading) {
            Object.assign(this.cascadeObj, {
              [item.cascading]:
                item.values.length > 0
                  ? item.value
                  : this.selectEvent(
                      this.defaultUserData[item.cascading.toUpperCase()],
                      item.cascading
                    ),
            });
          }
        });
      } else {
        Object.assign(item, {
          value: item.default_value ? item.default_value : item.value,
        });
        if (item.name.toLowerCase().includes('email')) {
          Object.assign(item, { value: this.userName });
        }
      }
    });

    this.finalFields = this.createFields;
    this.changeDetection.detectChanges();
    console.log(this.finalFields);
  }

  // getQueData(url, name): void {

  //   this.spinner.show();
  //   this.api.createAutoTask(this.submitUrl, url).subscribe(
  //     (res:any) => {
  //       this.spinner.hide();
  //       if (res.res_status === true) {
  //         this.queList[name] = this.onSuccessQueValues(res);

  //         this.createFields.map((item, i) => {
  //           if (item.create === true && item.create !== undefined && item.create !== null) {
  //             if (item.values !== undefined) {
  //               if (item.values.length > 0) {
  //                 Object.assign(item, { values: item.values, value: '' });
  //               } else {
  //                 if (item.url !== undefined && item.url !== null) {
  //                   if (item.name === name) {

  //                     if (this.queList[name] !== undefined && this.queList[name] !== null && this.queList[name].length !== 0) {
  //                       let fieldvalues = [];
  //                       if (typeof this.queList[name][0] === 'object') {
  //                         this.queList[name].map((subvalues) => {
  //                           const subObjValues = Object.values(subvalues);
  //                           fieldvalues.push(subObjValues[0]);
  //                         });
  //                       } else {
  //                         fieldvalues = this.queList[name];
  //                       }
  //                       Object.assign(item, { values: fieldvalues, value: '' });
  //                     }
  //                   }
  //                 } else {
  //                   Object.assign(item, { value: '', values: [] });
  //                 }
  //               }
  //             } else if (item.url !== undefined && item.url !== null) {

  //               if (item.name === name) {

  //                 if (this.queList[name] !== undefined && this.queList[name] !== null && this.queList[name].length !== 0) {
  //                   let fieldvalues = [];
  //                   if (typeof this.queList[name][0] === 'object') {
  //                     this.queList[name].map((subvalues) => {
  //                       const subObjValues = Object.values(subvalues);
  //                       fieldvalues.push(subObjValues[0]);
  //                     });
  //                   } else {
  //                     fieldvalues = this.queList[name];
  //                   }
  //                   Object.assign(item, { values: fieldvalues, value: '' });
  //                 }
  //               }

  //             } else {

  //               Object.assign(item, { value: '', values: [] });
  //             }

  //           }

  //         });

  //         this.finalFields = this.createFields;

  //         if (this.formData) {
  //           [this.formData].map((test) => {
  //             this.finalFields.map((item) => {
  //               if (item.values !== undefined) {
  //                 if (item.values.length > 0) {
  //                   Object.assign(item, { values: item.values, value: test[item.name.toLowerCase()] });
  //                 } else {
  //                   Object.assign(item, { value: test[item.name.toLowerCase()], values: [] });
  //                 }
  //               } else {
  //                 Object.assign(item, { value: test[item.name], values: [] });
  //               }
  //             });
  //           });
  //         }
  //       }
  //     },
  //     (err:any) => {
  //       this.onErrorr(err);
  //     }
  //   );
  // }
  // onSuccessQueValues(res): any {

  //   if (res.res_status === true) {
  //     return res.data;
  //   }

  // }

  getQueData(url: any, name: any) {
    const body: any = url;
    this.api.getListData(this.submitUrl, body).subscribe(
      (res: any) => {
        if (res.status === 200) {
          this.queList[name] = this.onSuccessQueValues(res.body, url.response);
          this.createFields.map((item) => {
            if (
              item.create === true &&
              item.create !== undefined &&
              item.create !== null
            ) {
              if (item.url !== undefined && item.url !== null) {
                if (item.name.toUpperCase() === name.toUpperCase()) {
                  let fieldvalues: any[] = [];

                  if (
                    this.queList[name] !== undefined &&
                    this.queList[name] !== null &&
                    this.queList[name].length !== 0
                  ) {
                    fieldvalues = this.queList[name];

                    Object.assign(item, {
                      values:
                        item.sort === false ? fieldvalues : fieldvalues.sort(),
                      value: item.default_value
                        ? item.default_value
                        : item.value,
                    });
                    Object.assign(this.cascadeObj, {
                      [name.toLowerCase()]: item.value,
                    });
                  } else {
                    Object.assign(item, {
                      values:
                        item.sort === false ? fieldvalues : fieldvalues.sort(),
                    });
                    Object.assign(this.cascadeObj, {
                      [name.toLowerCase()]: item.value,
                    });
                  }
                }
              } else if (item.values !== undefined) {
                Object.assign(item, {
                  values:
                    item.values.length > 0
                      ? item.sort === false
                        ? item.values
                        : item.values.sort()
                      : [],
                  value: item.default_value ? item.default_value : item.value,
                });
                Object.assign(this.cascadeObj, {
                  [name.toLowerCase()]: item.value,
                });
              } else {
                Object.assign(item, {
                  values: [],
                  value: item.default_value ? item.default_value : item.value,
                });
              }
            }
          });
          this.filters.map((item) => {
            this.createFields.map((subitem) => {
              if (item.url !== undefined && item.url !== null) {
                if (item.name.toLowerCase() === subitem.name.toLowerCase()) {
                  if (
                    this.queList[subitem.name] !== undefined &&
                    this.queList[subitem.name] !== null &&
                    this.queList[subitem.name].length !== 0
                  ) {
                    Object.assign(item, { values: this.queList[subitem.name] });
                  }
                }
              }
            });
          });

          this.finalFields = this.createFields;

          if (this.formData) {
            [this.formData].map((test) => {
              this.finalFields.map((item) => {
                if (item.values !== undefined) {
                  if (item.values.length > 0) {
                    Object.assign(item, {
                      values: item.values,
                      value: test[item.name.toLowerCase()],
                    });
                  } else {
                    Object.assign(item, {
                      value: test[item.name.toLowerCase()],
                      values: [],
                    });
                  }
                } else {
                  Object.assign(item, { value: test[item.name], values: [] });
                }
              });
            });
          }
          this.changeDetection.detectChanges();
        }
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessQueValues(res: any, bindkey: any) {
    let retList = [];
    if (bindkey !== undefined) {
      if (res[bindkey.key].length !== 0) {
        console.log(res[bindkey.key].length);
        res[bindkey.key].map((item: any) => {
          retList.push(item[bindkey.value]);
        });
      } else {
        retList = [];
      }
    } else {
      retList = res.data;
    }
    return retList;
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
      this.chainStoreData.map((item) => {
        chainArray.push(item.chain_nbr);
      });
      this.chainData = [...new Set(chainArray)];
      const preferenceData = this.general.getStoredPreferences();
      this.chainNbr = preferenceData.org_setup.chainnbr;
      this.selectStoreNbr(preferenceData.org_setup.chainnbr);
      this.storeNbr = preferenceData.org_setup.storenbr;
    }
  }
  selectStoreNbr(value: any): any {
    this.storeData = [];
    this.chainStoreData.map((item) => {
      if (item.chain_nbr === value) {
        this.storeData.push(item.store_nbr);
      }
    });
  }
  clearData(): void {
    this.finalFields.map((item) => {
      item.value = '';
    });
  }
  submitClaims(): void {
    this.spinner.show();
    let formbody = {};

    const createFields = this.finalFields;
    const validateObj = this.validateFormData(createFields);
    if (validateObj.valid.length !== 0) {
      return;
    }
    if (validateObj.checkexists.length !== 0) {
      return;
    }

    const finalFields = this.finalFields.reduce(
      (obj, item) => Object.assign(obj, { [item.name]: item.value }),
      {}
    );
    formbody = {
      data: finalFields,
      tbl_name: this.tableName,
      connector_name: this.connector,
      op_type: 'insert',
      url: this.createUrl,
      user_name: this.userName,
      name: this.userName.split('@')[0],
    };

    [finalFields].map((item) => {
      if (this.formName === 'claims') {
        item.CHAIN = this.chainNbr;
        item.STORE = this.storeNbr;
      }
    });
    const body = formbody;
    if (this.appType.toLowerCase() === 'helpdesk') {
      Object.assign(body, { returning_column: 'id' });
    }

    this.api.submitWorkFlow(body, this.submitUrl).subscribe(
      (res: any) => {
        this.onSuccessworkFlow(res, body);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  validateFormData(fields: any) {
    const flag: any = [];
    const validArray: any[] = [];
    const existedValues: any[] = [];
    let promptname;
    fields.map((item: any) => {
      if (
        item.display_name !== null &&
        item.display_name !== undefined &&
        item.display_name !== ''
      ) {
        promptname = item.display_name;
      } else {
        promptname = item.name;
      }
      if (
        item.required !== undefined &&
        item.required !== null &&
        item.required === true
      ) {
        if (
          item.value === '' ||
          item.value === undefined ||
          item.value === null
        ) {
          validArray.push(promptname);
          this.snack.open('Please enter :  ' + promptname, 'ok');
        }
        if (item.type === 'phone') {
          const phnnumlength = item.value.replaceAll('-', '');
          if (phnnumlength.length !== 10) {
            validArray.push(promptname);
            this.snack.open('Please enter valid:  ' + promptname, 'ok');
          }
        }
        if (item.values.length > 0) {
          flag[promptname] = this.checkValueExists(
            item.values,
            item.value.toLowerCase()
          );
          if (flag[promptname] === false) {
            existedValues.push(flag);
            this.snack.open('Entered ' + promptname + ' is not in list', 'ok');
          }
        }
      }

      if (item.type === 'email') {
        var mailformat =
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (item.value.match(mailformat)) {
        } else {
          validArray.push(promptname);
          this.snack.open('Please enter valid:  ' + promptname, 'ok');
        }
      }

      if (item.values.length > 0) {
        if (
          item.value !== '' &&
          item.value !== undefined &&
          item.value !== null
        ) {
          flag[promptname] = this.checkValueExists(
            item.values,
            item.value.toLowerCase()
          );
          if (flag[promptname] === false) {
            existedValues.push(flag);
            this.snack.open('Entered ' + promptname + ' is not in list', 'ok');
          }
        }
      }
    });

    const validatedObj = { valid: validArray, checkexists: existedValues };
    return validatedObj;
  }
  checkValueExists(values: any, value: any) {
    const checkValues = [];
    let flag: boolean;
    values.map((item: any) => {
      if (item.toLowerCase() === value.toLowerCase()) {
        checkValues.push(item);
      }
    });
    checkValues.length > 0 ? (flag = true) : (flag = false);
    return flag;
  }
  onSuccessworkFlow(data: any, body: any): void {
    this.spinner.hide();
    if (data.res_status === true) {
      this.snack.open(data.msg, 'Ok');
      if (this.appType.toLowerCase() === 'helpdesk') {
        Object.assign(body, { id: data.id });
        this.sendHelpdeskMail(body);
      }
      this.finalFields.map((item) => {
        item.value = '';
      });
    } else {
      this.snack.open(data.msg, 'Ok');
    }
  }
  sendHelpdeskMail(pageBody: any): void {
    const body = this.toLowerKeysMailObj([pageBody.data]);
    Object.assign(body[0], { id: pageBody.id });
    Object.assign(pageBody, {
      data: body[0],
      url: this.general.getHttpUrl('dplUrl') + 'send_helpdesk_mail',
    });
    console.log(pageBody);
    if (this.ticketStatus === false) {
      this.api.submitWorkFlow(pageBody, this.submitUrl).subscribe(
        (res: any) => {
          this.onSuccessSendMail(res);
        },
        (err: any) => {
          // this.onErrorr(err);
        }
      );
    } else if (this.ticketStatus === true) {
      this.createAutoTask(pageBody, this.actionBtns[0].url);
    }
  }

  createAutoTask(params: any, url: any): any {
    this.spinner.show();

    const body = { data: this.toLowerKeys([params.data]) };

    this.api.createAutoTask(body, url).subscribe(
      (res: any) => {
        this.onsuccessCreateTicket(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onsuccessCreateTicket(res: any): any {
    this.spinner.hide();
    this.ticketStatus = false;
  }
  toLowerKeys(obj: any): any {
    const nodes: any[] = [];
    const keys = Object.keys(obj[0]);
    const nodeObj: any = {};
    obj.map((item: any) => {
      keys.map((test) => {
        nodeObj[test.toLowerCase()] = item[test];
      });
      nodes.push(nodeObj);
    });
    nodes.map((item) => {
      Object.assign(item, { ticket_created_by: this.userName });
    });
    return nodes;
  }
  readURL(data: Event | any, name: any, type: any): void {
    const event = data.target.files;
    const fileToLoad = event[0];
    const fileReader: FileReader = new FileReader();
    fileReader.readAsDataURL(fileToLoad);
    let Logo: any;
    fileReader.onload = (fileLoadedEvent) => {
      Logo = fileReader.result;
      this.uploadedLogo = Logo;
      this.createFields.map((item) => {
        if (item.name === name) {
          Object.assign(item, { value: Logo });
        }
      });
    };
  }
  toLowerKeysMailObj(obj: any) {
    const nodes: any[] = [];
    const keys = Object.keys(obj[0]);
    const nodeObj: any = {};
    obj.map((item: any) => {
      keys.map((test) => {
        nodeObj[test.toLowerCase()] = item[test];
      });
      nodes.push(nodeObj);
    });
    // nodes.map((item) => {
    //   Object.assign(item, {ticket_created_by: this.appdata.getToken().user_name});
    // });
    return nodes;
  }
  onSuccessSendMail(res: any) {
    if (res.res_status === true) {
      // this.snack.open(res.msg, 'Ok');
    }
  }
  onErrorr(err: any): void {
    this.spinner.hide();
    Swal.fire({
      icon: 'error',
      text: err.msg,
    });
  }
  cancel(): void {
    this.spinner.hide();
  }
  formatDisplayName(name: any) {
    const rslt = name.replaceAll('_', ' ');
    const newString = rslt
      .split('(')
      .join('( ')
      .split(')')
      .join(' )')
      .split(' ')
      .map((w: any) => w[0].toUpperCase() + w.substring(1).toLowerCase())
      .join(' ');
    return newString;
  }
  changeValue(value: any, name: any) {
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
    }
    this.timerId = setTimeout(() => {
      this.selectEvent(value, name);
      this.timerId = null;
    }, 2000);
  }
  selectEvent(value: any, name: any) {
    this.createFields.map((item) => {
      if (item.values.length > 0) {
        Object.assign(this.cascadeObj, { [name.toLowerCase()]: value });
      }
      if (
        item.cascading !== undefined &&
        item.cascading !== null &&
        item.cascading !== ''
      ) {
        let cascadeList = [];
        cascadeList = item.cascading.split(',');
        // Object.keys(this.cascadeObj).map((subitem) => {
        //   if (cascadeList.includes(subitem)) {
        //     console.log(subitem);
        //   }
        // });

        if (cascadeList.includes(name.toLowerCase()) === true) {
          console.log(Object.values(cascadeList), name);
          this.payLoadData = '';
          this.passingValue = '';
          this.replaceName = '';
          const payloadObj = {};
          Object.assign(payloadObj, item.url);
          this.passingValue = value;
          this.reqData = item.url.request;

          Object.keys(this.cascadeObj).map((sub) => {
            this.passingValue = this.cascadeObj[sub.toLowerCase()];
            this.replaceName = '{' + sub.toLowerCase() + '}';
            if (this.reqData.includes(this.replaceName)) {
              this.reqData = this.reqData.replace(
                this.replaceName,
                this.passingValue
              );
            }
          });
          const enddate = this.formatQueryDate(new Date(), '');
          const startDate = this.formatQueryDate(
            new Date(new Date().setDate(new Date().getDate() - 30)),
            ''
          );

          if (this.reqData.includes('startdate')) {
            this.reqData = this.reqData.replace('{startdate}', startDate);
          }
          if (this.reqData.includes('enddate')) {
            this.reqData = this.reqData.replace('{enddate}', enddate);
          }

          Object.assign(payloadObj, { request: this.reqData });

          this.getQueData(payloadObj, item.name.toUpperCase());
        }
      }
    });
  }
  formatQueryDate(date: any, type: any) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    if (type === 'dmy') {
      return [day, month, year].join('-');
    } else {
      return [year, month, day].join('-');
    }
  }
  onChangeSearch(search: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e: any) {
    // do something
  }
  onKeyDown(event: KeyboardEvent) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[0-9]/.test(inp)) {
      const input = event.target as HTMLInputElement;
      let trimmed = input.value.replace(/\s+/g, '');

      if (trimmed.length > 11) {
        event.preventDefault();
        return false;
      } else {
        trimmed = trimmed.replace(/-/g, '');
        const numbers = [];
        numbers.push(trimmed.substr(0, 3));
        if (trimmed.substr(3, 3) !== '') {
          numbers.push(trimmed.substr(3, 3));
        }
        if (trimmed.substr(6, 4) !== '') {
          numbers.push(trimmed.substr(6, 4));
        }

        input.value = numbers.join('-');

        return true;
      }
    } else {
      event.preventDefault();
      return false;
    }
  }
}
