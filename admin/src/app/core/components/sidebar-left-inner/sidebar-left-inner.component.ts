import { Component, NgZone, OnInit } from '@angular/core';

//import services
import { AuthService, UtilsService } from '../../services'
import { environment } from '../../../../environments/environment'

@Component({
  selector: 'app-sidebar-left-inner',
  templateUrl: './sidebar-left-inner.component.html'
})
export class SidebarLeftInnerComponent {
  adminData:any = {}
  constructor(private authService:AuthService, private utilsService:UtilsService, private ngZone:NgZone){
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
