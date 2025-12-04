import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralService } from './general.service';


@Injectable()

export class ChatInterceptor implements HttpInterceptor {

    constructor(private gs: GeneralService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const data = this.gs.getUserToken();
        if ( data === '' || data === undefined || data === null ) {
            req = req.clone({ headers: req.headers.append('Content-Type', 'application/json')});
        }
        else {
            
             if (req.url.includes('assets/properties.json') === true){
                req = req.clone({ headers: req.headers.append('Content-Type', 'application/json')});
            }
            else if (req.method === 'GET') {

            }
            else if (req.body.formdata) {
                    req = req.clone({ headers: req.headers
                        .set('Authorization', 'Bearer ' + '').set('Content-Language', 'en-US') });
            }
            
            else {
                const sessionId = data[0].session_id;
                const userName = data[0].user_name;
                Object.assign(req.body, {user_name: userName , session_id: sessionId});
                req = req.clone({ headers: req.headers.append('Content-Type', 'application/json')});
            }
        }
        return next.handle(req);
    }
}
