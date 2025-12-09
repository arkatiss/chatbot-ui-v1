import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
// import { DynamicformService } from '../../services/dynamicform.service';
// import { HelperService } from '../../services/helper.service';
// import { TableRowCollapseEvent, TableRowExpandEvent } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-shared-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit, OnChanges {
  @ViewChild('dt1') dt1!: Table;
  @Input() permissions: any;
  @Input() columns: any;
  @Input() rowData: any;
  @Input() compName: any;
  @Input() screenName: any;
  @Input() showForm: any;
  @Output() editEvnt = new EventEmitter<string>();
  @Output() deleteEvnt = new EventEmitter<string>();
  @Output() childEditEvnt = new EventEmitter<string>();
  @Output() childDeleteEvnt = new EventEmitter<string>();
  @Output() multiSelectEvent = new EventEmitter<string>();
  @Output() editContextEvnt = new EventEmitter<string>();
  @Output() showSavedContextEvnt = new EventEmitter<string>();
  @Output() showFormPage = new EventEmitter<string>();
  @Output() searchEvnt = new EventEmitter<any>();
  @Output() dialogEvent = new EventEmitter<string>();
  @Input() selectiontgl: any;
  @Output() extractEmit = new EventEmitter<any>();
  @Output() refreshEmit = new EventEmitter<any>();
  @Output() levelsEvent = new EventEmitter<any>();
  @Input() filteredDomainOptions: any;
  @Input() domain: any;
  @Output() changeSubDomainForInfoset = new EventEmitter<any>();
  @Input() subDomain: any;
  imagePath = environment.imgUrl;
  imgUrl = environment.imageUrl;
  selectedRows: any = [];
  searchFilter: any;
  menuName: any;
  searchTerm: string = '';
  filteredRowData: any[] = [];
  infoMenuName: any;

  expandedRows: any[] = []; // Track expanded rows by UUID
  currentlyExpandedRow: any = null;
  contextArr: any[] = [];
  subMenuList: any[] = [];
  userMapList: any[] = [];

  constructor(private router: Router, private messageService: MessageService) {
    console.log('--menuName--', this.menuName);
    if (!this.menuName) {
      this.menuName = sessionStorage.getItem('activeListMenu');
    } else {
      this.menuName = sessionStorage.getItem('activeSubComponent');
    }
    // this.infoMenuName = sessionStorage.getItem('infosetSubMenu');
  }

  ngOnInit(): void {
    console.log('ngonit permissions:', this.permissions);
    if (
      Object.keys(this.filteredRowData).length === 0 &&
      this.compName === 'MD Search'
    ) {
      this.router.navigateByUrl('metadatasearch/information');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngonchanges permissions:', this.permissions);

    this.filteredRowData = this.rowData;
    console.log('screenName:', this.screenName);
  }
  editRowData(data: any, type: any, event: any) {
    // if (type.header !== 'Action' && event === 'cell') {
    //   this.editEvnt.emit(data);
    // }
    if (event === 'edit') {
      this.editEvnt.emit(data);
    }
  }
  deleteRowData(data: any) {
    this.deleteEvnt.emit(data);
  }
  selectRow(e: any): any {
    this.multiSelectEvent.emit(this.selectedRows);
  }

  contextEdit(event: any) {
    this.editContextEvnt.emit(event);
  }

  contextShowSaved(event: any) {
    this.showSavedContextEvnt.emit(event);
  }

  applyFilterGlobal(event: any, stringVal: any) {
    console.log(event, stringVal, this.searchFilter);
    const search = this.searchFilter.toString().toLowerCase();
    console.log(search, stringVal, this.searchFilter);
    // this.searchEvnt.emit(search);
    // this.datatable?.filterGlobal(search, stringVal);
  }

  filterData() {
    if (!this.searchTerm) {
      this.filteredRowData = this.rowData;
    } else {
      this.filteredRowData = this.rowData.filter((item: any) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
        )
      );
    }
  }
  addNewRecord() {
    this.showFormPage.emit();
  }
  linkClicked(event: any) {
    console.log(event);
    this.dialogEvent.emit(event);
  }
  levelsData(event: Event, overlayPanel: OverlayPanel, levelsData: any) {
    console.log('levels Data', levelsData);
    this.contextArr = levelsData.levels;
    overlayPanel.toggle(event); // open/close the panel
    // this.levelsEvent.emit(event);
  }
  subMenu(event: Event, overlayPanel: OverlayPanel, data: any) {
    console.log('subMenu Data', data);
    this.subMenuList = data?.submenu;
    overlayPanel.toggle(event); // open/close the panel
  }

  userMapping(event: Event, overlayPanel: OverlayPanel, data: any) {
    console.log('userMapping Data', data);
    this.userMapList = data?.menuMapping;
    overlayPanel.toggle(event); // open/close the panel
  }
  extractRecord(data: any) {
    this.extractEmit.emit(data);
  }

  // toggleRowExpansion(rowData: any) {
  //   const rowId = rowData.id; // Assuming `id` is a unique key in your rowData
  //   this.expandedRows[rowId] = !this.expandedRows[rowId]; // Toggle the expansion state
  // }

  isSQLBlock(rowData: any): boolean {
    return rowData.object_type === 'SQL Block';
  }

  isTableBlock(rowData: any): boolean {
    return rowData.object_type === 'Table Block';
  }

  isRowExpanded(rowData: any): boolean {
    return this.currentlyExpandedRow === rowData;
  }

  onRowExpand(event: any) {
    // Collapse the previously expanded row if it's not the same as the current one
    if (this.currentlyExpandedRow && this.currentlyExpandedRow !== event.data) {
      this.dt1.toggleRow(this.currentlyExpandedRow); // Collapse previous row
    }
    // Set the current row as expanded
    this.currentlyExpandedRow = event.data;
  }

  onRowCollapse(event: any) {
    // Clear the currently expanded row if it's collapsed
    if (this.currentlyExpandedRow === event.data) {
      this.currentlyExpandedRow = null;
    }
  }

  refreshData() {
    this.refreshEmit.emit();
  }
  childEditRowData(rowData: any, childData: any) {
    const data: any = {
      rowData: rowData,
      childData: childData,
    };
    console.log(rowData, childData);
    this.childEditEvnt.emit(data);
  }
  childDeleteRowData(rowData: any, childData: any) {
    const data: any = {
      rowData: rowData,
      childData: childData,
    };
    console.log(rowData, childData);
    this.childDeleteEvnt.emit(data);
  }

  objectKeys = Object.keys;

  toTitleCase(value: string): string {
    if (!value) return '';
    return value
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  changeSubDomain() {
    const obj = { domain: this.domain.domain, subDomain: this.subDomain };
    this.changeSubDomainForInfoset.emit(obj);
  }
}
