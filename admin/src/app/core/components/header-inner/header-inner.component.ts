import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class

//import services
import { AuthService, UtilsService } from '../../services'
import { environment } from '../../../../environments/environment'
@Component({
  selector: 'app-header-inner',
  templateUrl: './header-inner.component.html'
})
export class HeaderInnerComponent implements OnInit{
  
  adminData:any = {}
  constructor(private router: Router, private authService:AuthService, private toastrManager:ToastrManager, private utilsService:UtilsService, private ngZone:NgZone){
    
  }
  logout(){
   
    this.toastrManager.successToastr(environment.MESSAGES['SUCCESSFULLY-LOGOUT'], 'Success!');//showing success toaster
    localStorage.removeItem('loggedin-adminId');
    localStorage.clear();
    this.authService.isLoggedIn(false, '');
    this.router.navigate(['/auth/login']);   
  }

  ngOnInit() {
    

    this.authService.checkLoggedinStatus().subscribe((loginStatus) => {   

      if(loginStatus.isLoggedIn){
        this.fetchAdmininfo()
      }
     });

     if (localStorage.getItem('loggedin-adminId')) {
        this.fetchAdmininfo()
     }
  }

  fetchAdmininfo(){
    this.utilsService.processPostRequest('/auth/adminInfo',{userID:localStorage.getItem('loggedin-adminId')}).subscribe((response:any) => {
      //console.log('response',response);
       this.ngZone.run(() => {
         this.adminData = response['data']
       });
        
       
     });
  }
}
