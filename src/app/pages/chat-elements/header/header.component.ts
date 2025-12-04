import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GeneralService } from '../../../helper/general.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(private gs: GeneralService) {}
  @Input() slecttabclass: any;
  @Output() showTabSelected = new EventEmitter();
  @Input() userrole: any;
  showAGentTab = false;
  ngOnInit(): void {
    this.gs.getShowAgent().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          this.showAGentTab = true;
        } else {
        }
      }
    });
  }
  showSelectedTab(val: any): any {
    this.showTabSelected.emit(val);
  }
}
