import { Component } from '@angular/core';

@Component({
  selector: 'app-popup-messages',
  templateUrl: './popup-messages.component.html',
  styleUrl: './popup-messages.component.scss',
})
export class PopupMessagesComponent {
  colData: any[] = [];
  rowData: any[] = [];
  screenName: any = 'Pop up Messages';
  popupFlag: any | boolean = false;

  editRow(event: any) {
    console.log(event);
  }
  showForm(event: any) {
    this.popupFlag = true;
  }
}
