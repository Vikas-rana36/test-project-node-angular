import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

//modules core services
import { AuthService } from '../services'
import { LayoutService } from 'angular-admin-lte';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuardService implements CanActivate {
  public customLayout: boolean;

  constructor(private authService: AuthService, private router: Router, private layoutService: LayoutService,) { }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot,) {
    let loggedinAdminId = localStorage.getItem("loggedin-adminId") || ''
    if (loggedinAdminId.length) {
      // logged in so return true
      return true;
    }   
   
    // not logged in so redirect to login page with the return url     
    localStorage.clear();
    this.authService.isLoggedIn(false, '');
    //window.location.reload();
    this.router.navigate(['/auth/login']);
    
    return false;
  }

}
