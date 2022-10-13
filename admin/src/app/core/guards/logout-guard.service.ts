import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services'
import { LayoutService } from 'angular-admin-lte';
import { ToastrManager } from 'ng6-toastr-notifications';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuardService implements CanActivate {
  public customLayout: boolean;

  constructor(private authService: AuthService, private router: Router, private layoutService: LayoutService, private toastrManager:ToastrManager) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
    this.toastrManager.successToastr(environment.MESSAGES['SUCCESSFULLY-LOGOUT'], 'Success!');
    localStorage.removeItem('loggedin-adminId');
    localStorage.clear();
    this.authService.isLoggedIn(false, '');
    this.router.navigate(['/auth/login']);
    return false;
  }

}
