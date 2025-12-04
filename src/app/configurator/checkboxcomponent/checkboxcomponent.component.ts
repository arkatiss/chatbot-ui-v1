import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit } from '@angular/core';
import { PeriodicElement } from '../trainingbot/trainingbot.component';
import { TrainingbotComponent } from '../trainingbot/trainingbot.component';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-checkboxcomponent',
  templateUrl: './checkboxcomponent.component.html',
  styleUrls: ['./checkboxcomponent.component.scss'],
})
export class CheckboxcomponentComponent implements OnInit {
  constructor(private tb: TrainingbotComponent) {}
  public params: ICellRendererParams | any;
  selection = new SelectionModel<PeriodicElement>(true, []);
  ngOnInit(): void {}
  agInit(params: ICellRendererParams): void {
    this.params = params;
  }
  selectIntent(data: any, event: any, i: any): any {
    this.tb.selectIntent(data, event, i);
  }
}
