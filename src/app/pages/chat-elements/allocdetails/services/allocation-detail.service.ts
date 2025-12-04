import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { ErrorService } from 'src/app/helper/error.service';
import { GeneralService } from 'src/app/helper/general.service';
@Injectable({
  providedIn: 'root'
})
export class AllocationDetailService {
 

  constructor(private http: HttpClient, private err: ErrorService, private gs: GeneralService) { }

  getAllocationDetails(body): Observable<any> {
    return this.http.post(this.gs.getHttpUrl('serverHost') + 'get_order_details', body).pipe(catchError(this.err.handleError));
  }

  getProrationDetails(body): Observable<any> {
    return this.http.post(this.gs.getHttpUrl('serverHost') + 'get_inventory_by_item', body).pipe(catchError(this.err.handleError));
  }

}
