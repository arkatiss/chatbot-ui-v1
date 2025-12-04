import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  constructor() {}
  jsonObject: any;
  public setDiagnosticsData(objKey: any, data: any) {
    this.jsonObject = { jsonData: data };
    Object.assign(this.jsonObject, { [objKey]: data });
  }

  public getDiagnosticsData() {
    return this.jsonObject;
  }
}
