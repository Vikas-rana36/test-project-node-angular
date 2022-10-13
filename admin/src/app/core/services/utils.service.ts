import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from '@angular/common/http';
import { ToastrManager } from 'ng6-toastr-notifications';//toaster class
import { Router } from "@angular/router";
//import shared services
import { PageLoaderService } from './page-loader.service'
import { AuthService } from './auth.service'
import { environment } from '../../../environments/environment'
import Swal from 'sweetalert2'
import * as moment from 'moment-timezone'; 

@Injectable({ providedIn: 'root' })
export class UtilsService { 

 
  constructor(private httpClient: HttpClient, private toastrManager:ToastrManager, private pageLoaderService: PageLoaderService, private authService:AuthService, private router:Router) { }

  
  /**
  * Show page loder on fetching data
  * @return void
  */
  public showPageLoader(message = ''):void{
    this.pageLoaderService.pageLoader(true);//show page loader
    if(message.length>0){      
      this.pageLoaderService.setLoaderText(message);//setting loader text
    }
    
  }

  /**
  * Hide page loder on fetching data
  * @return void
  */
  public hidePageLoader(): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text
  }

  /**
  * Show alert on success response & hide page loader
  * @return void
  */
  public onSuccess(message:any): void {
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.pageLoaderService.setLoaderText('');//setting loader text empty
    this.toastrManager.successToastr(message, 'Success!'); //showing success toaster 
  }

  /**
  * Show alert on error response & hide page loader
  * @return void
  */
  public onError(message:any): void {
    this.pageLoaderService.setLoaderText('');//setting loader text
    this.pageLoaderService.pageLoader(false);//hide page loader
    this.toastrManager.errorToastr(message, 'Oops!',{maxShown:1});//showing error toaster message  
  }

  /**
  * Logout user from the system and erase all info from localstorage
  * @return void
  */
  public logout():void{
    this.toastrManager.successToastr('Loggedout Successfully', 'Success!');//showing 
    
    localStorage.clear();
    //this.authService.isLoggedIn(false);
    this.router.navigate(['/']);    
  }

  /**
  * Check the user is loggedin oterwise redirect to login page
  * @return void
  */

  public checkAndRedirect(){
    if (localStorage.getItem("loggedin-adminId")) {
      this.router.navigate(['/dashboard']);
    }
  }

  /**
  * Post the data and endpoint 
  */
  processPostRequest(apiEndPoint:any, data:any){
    return this.httpClient
        .post(apiEndPoint, data)
  }
  /**
  * Get the data using posted endpoint 
  */
  processGetRequest(apiEndPoint:any){
    return this.httpClient
        .get(apiEndPoint)
  }
  // format date based on momemnt. if timezone is available then also return timezone
  dateFormate(value: string | Date, timeZone = '', format = 'MMM D, YYYY, h:mm:ss A') {
    const time = moment(value);
    if (value && time.isValid()) {
        return timeZone ? time.tz(timeZone).format(format) : time.format(format);
    } else {
        return value;
    }
  }

  /**
     *
     * @param a  | data
     * @param b  | filter obj
     * @param c  | key
     */
   dataTableSearch(a:any, b:any, c:any) {
    let i = a[c];
    let result;
    switch (typeof i) {
        case 'string':
            result = i ? i.toLowerCase().indexOf(b[c].toLowerCase()) === -1 : true;
            break;
        case 'number':
            // result = i >= 0 ? (i !== parseFloat(b[c])) : true;
            result = i.toString().toLowerCase() ? i.toString().toLowerCase().indexOf(b[c].toLowerCase()) === -1 : true;
            break;
        case 'boolean':
            result = i == null && i === undefined ? true : i !== (b[c] === 'true');
            break;
        case 'object':
            if (Array.isArray(i) && i.length) {
                i.some(el => {
                    result = el ? el.toLowerCase().indexOf(b[c].toLowerCase()) === -1 : true;
                    return !result;
                });
            } else {
                result = true;
            }
            break;
        default:
            result = true;
    }
    return result;
  }
}