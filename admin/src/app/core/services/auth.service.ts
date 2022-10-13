import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

import { Router, ActivatedRoute } from "@angular/router";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public loggedIn: Subject<any> = new Subject<any>();
  public profileUpdatedStatus: Subject<any> = new Subject<any>();

  constructor(private httpClient: HttpClient, private router: Router) { }

  isLoggedIn(value: boolean, userType: String) {
    this.loggedIn.next({ isLoggedIn: value, userType: userType });
  }
  checkLoggedinStatus(): Observable<any> {
    return this.loggedIn.asObservable();
  }

  isProfileUpdated(value: boolean) {
    this.profileUpdatedStatus.next(value);
  }
  getUpdatedProfileStatus(): Observable<any> {
    return this.profileUpdatedStatus.asObservable();
  }

  /***************************************************************************
   * Admin Auth Funtions
   *******************************************************************/
    

  isSellerLoggedin(){
    /*if (JSON.parse(localStorage.getItem("loggedinUser"))) {
      // logged in so return true
      return true;
    }
    return false*/
  }

  login(postedData:any): Observable<any> {

    return this.httpClient
      .post('/auth/login', postedData, { observe: 'response' })
      .pipe(map((response) =>response))

  } 

  fetchAdminData(postedData:any): Observable<any> {

    return this.httpClient
      .post('/fetchData', postedData)      
      .pipe(map((response) =>response))

  }
  verifyToken(postedData:any): Observable<any> {      
    return this.httpClient
        .post('/admin/verifyToken', postedData)  
  } 

   
}