import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PageLoaderService {

    public pageLoaderStatus: Subject<boolean> = new Subject<boolean>()
    public shouldPageLoad: Subject<boolean> = new Subject<boolean>()
    public pageLoaderText: Subject<any> = new Subject<any>();
    private keepAfterRouteChange = false;

    constructor(private router: Router) {
      // clear alert messages on route change unless 'keepAfterRouteChange' flag is true
      router.events.subscribe(event => {
          if (event instanceof NavigationStart) {
              if (this.keepAfterRouteChange) {
                  // only keep for a single route change
                  this.keepAfterRouteChange = false;
              } else {
                  // clear alert messages
                  this.clear();
              }
          }
      });
  }

  clear() {
      // clear alerts
      this.pageLoaderText.next('');
  }

  pageLoader(value: boolean) {
    //console.log('value:' + value);
    this.pageLoaderStatus.next(value)
  }

  setLoaderText(text?: String) {
    this.pageLoaderText.next(text);
  }
  getLoaderText(): Observable<any> {
    return this.pageLoaderText.asObservable();
  }
  refreshPage(value:any){
      this.shouldPageLoad.next(value);
  }
}
