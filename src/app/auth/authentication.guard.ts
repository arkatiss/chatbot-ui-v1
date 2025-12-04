import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivateChild,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GeneralService } from '../helper/general.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router, private gs: GeneralService) {}
  canActivate(
    route: ActivatedRouteSnapshot | any,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree
    | any {
    let userrole;
    this.gs.getUserRoleData().subscribe((info: any) => {
      if (Object.keys(info).length > 0) {
        if (info) {
          userrole = info;
        } else {
        }
      }
    });
    if (userrole) {
      if (route.data.roles && route.data.roles.indexOf(userrole) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['auth/forbidden']);
        return false;
      }

      // authorised so return true
      return true;
    }
    // return true;
  }
  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.canActivate(next, state);
  }
}
