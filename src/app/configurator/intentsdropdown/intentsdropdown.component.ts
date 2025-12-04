import { PagesService } from './../../pages/pages.service';
// import { ICellRendererParams } from '@ag-grid-community/all-modules';
import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConfigService } from '../service/config.service';
import { ErrorService } from '../../helper/error.service';
import { ICellRendererParams } from 'ag-grid-community';
// import { TrainingbotComponent } from '../trainingbot/trainingbot.component';

interface PeriodicElement {
  date: string;
  priority: string;
  type_of_interaction: string;
  actions: string;
}
@Component({
  selector: 'app-intentsdropdown',
  templateUrl: './intentsdropdown.component.html',
  styleUrls: ['./intentsdropdown.component.scss'],
})
export class IntentsdropdownComponent implements OnInit {
  // @ViewChild(TrainingbotComponent) tb: TrainingbotComponent | any;
  filteredIntents: Observable<string[]> | any;
  intent = new FormControl();
  tagsData = [];
  public params: ICellRendererParams | any;
  selection = new SelectionModel<PeriodicElement>(true, []);
  passingIntentValue: any;
  constructor(
    public snack: MatSnackBar,
    private error: ErrorService,
    // private tb: TrainingbotComponent,
    private ps: PagesService
  ) {}
  ngOnInit(): void {
    this.ps.getIntentsData().subscribe((info: any) => {
      if (info !== undefined && info !== null) {
        if (info.length !== 0) {
          this.tagsData = info;
          this.onSuccessTags(info);
          // this.filteredIntents = this.intent.valueChanges.pipe(
          //       startWith(''),
          //       map(val => this.Intentfilter(val))
          // );
        }
      }
    });
  }
  agInit(params: ICellRendererParams): void {
    this.params = params;
    Object.assign(this.params.data, { checked: false, annotate: false });
  }

  // getTags(): any {
  //   const body = { yml_type: 'retrieve' };
  //   this.cs.retrainYml(body).subscribe(
  //     (res) => {
  //       this.onSuccessTags(res);
  //     },
  //     (err) => {
  //       this.onErrorr(err);
  //     }
  //   );

  // }
  // onErrorr(data): any {
  //   this.snack.open(this.error.handleError(data), 'Ok', { duration: 5000 });
  // }
  onSuccessTags(data: any): any {
    this.tagsData = data;
    this.filteredIntents = this.intent.valueChanges.pipe(
      startWith(''),
      map((val) => this.Intentfilter(val))
    );
  }
  Intentfilter(val: any): string[] {
    const filterValue = val.toLowerCase();
    return this.tagsData.filter((option: any) =>
      option.intent.toLowerCase().includes(filterValue)
    );
  }
  // onSelectionChange(event: any, value: any, idxNum: any, data: any): void {
  //   this.passingIntentValue = data.intent;
  //   // this.tb.rowData[idxNum].annotate = true;
  //   // this.tb.rowData[idxNum].intentValue = data.intent;
  //   // this.tb.onSelectionChange(event, value, idxNum, data);
  // }
  // selectIntent(data: any, event: any, i: any, params: any): any {
  //   this.tb.rowData[i].checked = true;
  //   this.tb.selectIntent(data, event, i);
  // }
  // navigateAnnotation(data: any): void {
  //   this.tb.intent.setValue(data.intentValue);
  //   this.tb.navigateAnnotation([
  //     { utterance: data.failed_intent, id: data.id },
  //   ]);
  // }
  onSelectionChange(event: any, value: any, idxNum: any, data: any): void {
    const parent = this.params.context.parent; // reference to TrainingbotComponent
    this.passingIntentValue = data.intent;
    parent.rowData[idxNum].annotate = true;
    parent.rowData[idxNum].intentValue = data.intent;
    parent.onSelectionChange(event, value, idxNum, data);
  }

  selectIntent(data: any, event: any, i: any, params: any): any {
    const parent = this.params.context.parent;
    parent.rowData[i].checked = true;
    parent.selectIntent(data, event, i);
  }

  navigateAnnotation(data: any): void {
    const parent = this.params.context.parent;
    parent.intent.setValue(data.intentValue);
    parent.navigateAnnotation([{ utterance: data.failed_intent, id: data.id }]);
  }
}
