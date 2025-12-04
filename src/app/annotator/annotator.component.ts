import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Annotation, NgxAnnotateTextComponent } from 'ngx-annotate-text';
import { AnnotatorService } from './service/annotator.service';
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { PagesService } from '../pages/pages.service';
// import { Observable } from 'rxjs-compat';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ErrorService } from '../helper/error.service';
import { GeneralService } from '../helper/general.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-annotator',
  templateUrl: './annotator.component.html',
  styleUrls: ['./annotator.component.scss'],
  animations: [
    // the fade-in/fade-out animation.
    trigger('simpleFadeAnimation', [
      // the "in" style determines the "resting" state of the element when it is visible.
      state('in', style({ opacity: 1 })),

      // fade in when created. this could also be written as transition('void => *')
      transition(':enter', [style({ opacity: 0 }), animate(600)]),

      // fade out when destroyed. this could also be written as transition('void => *')
      transition(':leave', animate(600, style({ opacity: 0 }))),
    ]),
  ],
})
export class AnnotatorComponent implements OnInit {
  @ViewChild('annotateText') ngxAnnotateText: NgxAnnotateTextComponent | any;

  //text: string = 'On August 1, we went on vacation to Barcelona, Spain. Our flight took off at 11:00 am.';

  annotations: Annotation[] = [
    // new Annotation(3, 11, 'Date', '#0069d9'),
    // new Annotation(36, 45, 'City', '#dc3545'),
    // new Annotation(47, 52, 'Country', '#28a745'),
    // new Annotation(77, 85, 'Time', '#5a6268'),
  ];

  pickleData: any[] = [];
  annotationsData: any[] = [];
  clases: any[] = [];
  entitiesData: any[] = [];
  //annotations: Annotation[] = [
  // new Annotation(3, 11, 'Date', '#0069d9'),
  // new Annotation(36, 45, 'City', '#dc3545'),
  // new Annotation(47, 52, 'Country', '#28a745'),
  // new Annotation(77, 85, 'Time', '#5a6268'),
  //];
  fileContent: any[] = [];
  annotateFileData: any;
  annotate: any;
  tags: any[] = [];
  fileLength = 1;
  downloadJsonHref: any;
  form: FormGroup | any;
  annotateFlag = true;
  progress = 0;
  domain: any;
  intent: any;
  annotatorGroup: FormGroup | any;
  domains!: Observable<string[]>;
  tagsData: any[] = [];
  domainsData: any[] = [];
  domaintags: any[] = [];
  tagging = true;
  logId: any[] = [];
  showTagText = true;
  storedIntent: any;
  domainLength: any;
  keyColumn: any;
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef;
  uploadResponse: any;
  constructor(
    private gs: GeneralService,
    private annotateService: AnnotatorService,
    private spinner: NgxSpinnerService,
    private ps: PagesService,
    private fb: FormBuilder,
    private router: Router,
    private pageservice: PagesService,
    private error: ErrorService
  ) {
    this.form = new FormGroup({
      file: new FormControl(),
      user_name: new FormControl(),
      session_id: new FormControl(),
    });
    this.annotatorGroup = this.fb.group({
      domain: new FormControl(['']),
      // subDomain: new FormControl(['']),
    });
  }
  templength: any;
  ngOnInit(): void {
    const annotateData: any[] = this.ps.getAnnotationData();
    this.pageservice.setAnnotationData([]);
    if (annotateData.length > 0) {
      const fileData: any[] = [];
      const logId = [];
      const intent = annotateData[0].intent;
      this.uploadResponse = annotateData[0].responses[0];
      this.intent = intent;
      this.storedIntent = intent;
      annotateData.map((item: any) => {
        fileData.push(item?.utterance);
        this.logId.push(item?.id);
      });
      this.fileContent = fileData;
      this.templength = this.fileContent.length;
      this.annotateFileData = this.fileContent[0];
      this.getDomains();
      this.tagging = false;
    }
  }
  getDomains(): void {
    const body = {};
    this.annotateService.onInitialise(body).subscribe(
      (res: any) => {
        this.onSuccessDomains(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  onSuccessDomains(data: any): void {
    this.domainsData = data.data;
    if (this.domainsData !== undefined && this.domainsData.length !== 0) {
      this.domainsData.map((item: any) => {
        this.tagsData.push(item.domain);
        if (item.intent.toLowerCase() === this.intent.toLowerCase()) {
          this.tags = item.tags;
        }
      });
      this.domains = this.annotatorGroup.controls.domain.valueChanges.pipe(
        startWith(''),
        map((val) => this.domainFilter(val))
      );
    }
  }
  onDomain(evt: any): void {
    this.domainsData.map((item) => {
      if (item.domain === evt) {
        this.tags = item.tags;
        //this.tags = this.domaintags;
        this.intent = item.intent;
        this.domain = evt;
      }
    });
  }
  domainFilter(val: any): string[] {
    const filterValue = val.toLowerCase();
    return this.tagsData.filter((option: any) =>
      option.toLowerCase().includes(filterValue)
    );
  }
  onChange(event: any): void {
    const fileList: any = event.target.files;
    // if (fileList.length > 0) {
    const formData = new FormData();
    const file = fileList[0];
    const data = this.gs.getUserToken();
    const sessionId = data[0].session_id;
    const userName: any = data[0].user_name;
    this.form.get('user_name').setValue(userName);
    this.form.get('session_id').setValue(sessionId);
    formData.append('user_name', this.form.get('user_name').value);
    formData.append('session_id', this.form.get('session_id').value);
    formData.append('data_file', file);
    this.onUpload(formData);
  }
  onUpload(formData: any): void {
    this.spinner.show();
    Object.assign(formData, { formdata: 'formvalue' });
    this.annotateService.onSubmit(formData).subscribe(
      (res: any) => {
        this.onSuccessupload(res);
      },
      (err: any) => {
        this.onErrorr(err);
      }
    );
  }
  increment(progress: any): void {
    this.progress += progress;
  }

  decrement(): void {
    this.progress--;
  }
  onSuccessupload(data: any): void {
    if (data.res_status === true) {
      this.spinner.hide();
      const finalResult = data.data;
      if (finalResult.length > 0) {
        this.domain = data.domain;
        this.intent = data.intent;
        this.keyColumn = data.key_column;
        this.uploadResponse = data.response;
        this.fileContent = finalResult;
        const progress = this.fileContent.length;
        const updateprogress = 100 / progress;
        this.increment(updateprogress);
        this.annotateFileData = finalResult[0];
        this.tags = data.tags.concat(this.tags);
      } else {
        Swal.fire({ title: 'No New Utterances Found' });
      }
    } else {
      this.spinner.hide();
      Swal.fire({ title: data.msg });
    }
  }

  addNewAnnotation(): any {
    if (this.tags.includes(this.annotate)) {
      alert('already exists');
    } else {
      this.tags.push(this.annotate);
      this.annotate = '';
    }
  }
  addAnnotation(label: string, color: string): void {
    debugger;
    if (this.ngxAnnotateText) {
      const selection = this.ngxAnnotateText.getCurrentTextSelection();
      if (selection) {
        this.annotations = this.annotations.concat(
          new Annotation(selection.startIndex, selection.endIndex, label, color)
        );
      }
    }
  }
  resetAnnotation(): void {
    // this.tags = [];
    this.annotations = [];
  }

  removeAnnotation(val: any): void {
    const idx = this.tags.findIndex((i) => i === val);
    this.tags.splice(idx, 1);
  }
  saveAnnotateData(): void {
    // if (this.annotations.length > 0) {
    this.entitiesData = [];
    if (this.annotations.length === 0) {
      this.entitiesData.push([0, 0, 'test']);
    }
    this.annotations.map((item: any) => {
      const length = item.text.length;
      let startIdx = item.startIndex;
      let endIdx = item.endIndex;
      if (item.text[0] === ' ') {
        startIdx = startIdx + 1;
        endIdx = endIdx;
      }
      if (item.text[length - 1] === ' ') {
        startIdx = startIdx;
        endIdx = endIdx - 1;
      }
      this.entitiesData.push([startIdx, endIdx, item.label]);
    });
    if (this.fileLength < this.fileContent.length) {
      this.annotateFileData = this.fileContent[this.fileLength];
      this.annotationsData.push([
        this.fileContent[this.fileLength - 1].toLowerCase(),
        { entities: this.entitiesData },
      ]);
      this.fileLength = this.fileLength + 1;
    } else {
      if (this.fileLength === this.fileContent.length) {
        this.clases = this.clases.filter((el, i, a) => i === a.indexOf(el));
        this.annotationsData.push([
          this.fileContent[this.fileLength - 1].toLowerCase(),
          { entities: this.entitiesData },
        ]);
      }
    }
    // this.linkAnnotationData = this.annotationsData;
    const progress = this.fileLength;
    const updateprogress = 100 / progress;
    this.increment(updateprogress);
    this.annotations = [];
  }
  checkValue(evt: any): void {
    this.domainLength = evt.value.length;
    if (this.domainLength === 0) {
      this.annotatorGroup.get('domain').setValue('');
    }
  }
  submitAnnotateData(): void {
    this.spinner.show();

    if (this.annotations.length > 0) {
      this.saveAnnotateData();
    } else {
      this.saveAnnotateData();
    }
    this.pickleData.push({
      classes: this.tags,
      annotations: this.annotationsData,
    });
    let domainValue;
    if (this.tagging === false) {
      domainValue = this.annotatorGroup.get('domain').value;
    } else {
      domainValue = this.domain;
    }
    if (this.tagging === false) {
      if (
        domainValue === '' ||
        domainValue === undefined ||
        domainValue === null ||
        this.domainLength === 0 ||
        this.domainLength === undefined ||
        this.domainLength === null
      ) {
        domainValue = this.intent;
      } else {
        domainValue = domainValue;
      }
    }
    let keyColumn;
    if (this.keyColumn !== undefined && this.keyColumn !== null) {
      keyColumn = this.keyColumn;
    } else {
      keyColumn = '';
    }
    const body = {
      domain: domainValue.toLowerCase(),
      intent: this.intent,
      trained_data: this.pickleData[0],
      key_column: keyColumn,
      response: this.uploadResponse,
    };
    this.annotateService.botTraining(body).subscribe(
      (res: any) => {
        this.onSuccessBotTraining(res);
      },
      (err: any) => {
        this.onBotErrorr(err);
      }
    );
  }
  onSuccessBotTraining(data: any): void {
    this.spinner.hide();
    Swal.fire({ text: data.msg });
    if (data.res_status === true) {
      if (this.tagging === false) {
        const body = {
          id: this.logId,
          status: 'Completed',
          retraining_type: 'update',
        };
        this.annotateService.retrainingData(body).subscribe(
          (res: any) => {
            this.onSuccessReTraining(res);
          },
          (err: any) => {
            this.onBotErrorr(err);
          }
        );
      }
      this.annotateFileData = undefined;
      this.annotations = [];
      this.tags = [];
      this.progress = 0;
      this.fileContent = [];
      this.entitiesData = [];
      this.fileLength = 1;
      this.pickleData = [];
      this.annotationsData = [];
    }
  }
  onSuccessReTraining(data: any): void {
    if (data.res_status === true) {
      this.router.navigateByUrl('/config/training');
    } else {
      this.error.handleError(data);
    }
  }
  onBotErrorr(error: any): any {
    this.spinner.hide();
    Swal.fire({ text: error.msg });
    this.error.handleError(error);
    this.annotateFileData = undefined;
    this.annotations = [];
    this.tags = [];
    this.progress = 0;
    this.fileContent = [];
    this.entitiesData = [];
    this.fileLength = 1;
    this.pickleData = [];
    this.annotationsData = [];
  }
  onErrorr(error: any): void {
    this.spinner.hide();
    Swal.fire({ text: this.error.handleError(error) });
  }
  showInp(): void {
    this.showTagText = !this.showTagText;
    this.annotatorGroup.get('domain').setValue('');
    if (this.showTagText === true) {
    } else {
      this.intent = this.storedIntent;
      this.tags = [];
    }
  }
  saveDrop(): void {}
  downloadFile(): void {
    const fileurl = this.gs.getPropertiesUrl();
    const link = document.createElement('a');
    link.setAttribute('target', '_blank');
    link.setAttribute('href', fileurl.filesurl + 'example.txt');
    link.setAttribute('download', `example.txt`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}
