import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../models/item';

@Component({
  selector: 'list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.scss'],
})
export class ListItemComponent {
  @Input() item: Item | any;
  @Input() parentItem?: Item | any;
  @Input() selectedUUID: Item | any;
  selectedParentId: any;
  selectedUId: any;
  @Input() public set connectedDropListsIds(ids: string[]) {
    this.allDropListsIds = ids;
  }
  public get connectedDropListsIds(): any[] {
    return this.allDropListsIds.filter((id) => id !== this.item.uniqueId);
  }
  public allDropListsIds: string[];

  public get dragDisabled(): boolean {
    return !this.parentItem;
  }

  public get parentItemId(): string {
    return this.dragDisabled ? '' : this.parentItem.uniqueId;
  }

  @Output() itemDrop: EventEmitter<CdkDragDrop<Item>>;

  constructor() {
    this.allDropListsIds = [];
    this.itemDrop = new EventEmitter();
  }

  public onDragDrop(event: CdkDragDrop<Item, Item>): void {
    //const obj  = { event: event, index: idx};
    // Object.assign(event.item.data,{index: idx+'.'+event.item.data.index});
    this.itemDrop.emit(event);
  }

  getParentId(val: any, id: any): any {
    this.selectedParentId = val;
    this.selectedUId = id;
  }
  public getSelectedId(): any {
    return this.selectedParentId;
  }
}
