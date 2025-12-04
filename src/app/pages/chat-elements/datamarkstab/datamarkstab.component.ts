import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-datamarkstab',
  templateUrl: './datamarkstab.component.html',
  styleUrls: ['./datamarkstab.component.scss'],
})
export class DatamarkstabComponent implements OnInit {
  @Input() datamarks: any;
  @Output() openTab = new EventEmitter();
  @Input() datadatewise: any;
  @Output() openDataMarksData = new EventEmitter();
  @Input() message: any;
  constructor() {}

  ngOnInit(): void {
    if (this.datamarks?.length !== 0) {
      this.datamarks = this.datamarks;
    } else {
      this.datamarks = ['Sales for today', 'Service level for today'];
    }
  }
  selectedDatamark(val: any): void {
    this.openTab.emit(val);
  }
  Datamarksdata(val: any): void {
    this.openDataMarksData.emit(val);
  }
}
