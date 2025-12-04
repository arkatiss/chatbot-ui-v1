import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-myview',
  templateUrl: './myview.component.html',
  styleUrls: ['./myview.component.scss'],
})
export class MyviewComponent implements OnInit {
  constructor() {}
  @Input() selectsubtabclass: any;
  @Output() showSubTabs = new EventEmitter();
  @Input() showsuggestionsbool: Boolean | any;
  @Input() suggetionsData: any;
  @Output() suggestionClick = new EventEmitter();
  @Input() showrecommendationsview: Boolean | any;
  @Output() selectForecasting = new EventEmitter();
  @Input() submyviewtabclass: any;
  @Input() showforecastingview: Boolean | any;
  @Input() showcollabarativeview: Boolean | any;

  ngOnInit(): void {
    debugger;
  }
  showsuggestionsdatamarks(val: any): void {
    this.showSubTabs.emit(val);
  }
  chatuser(val: any): void {
    this.suggestionClick.emit(val);
  }
  forecasting(val: any): void {
    this.selectForecasting.emit(val);
  }
}
