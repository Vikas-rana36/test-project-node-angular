import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { LayoutService } from 'angular-admin-lte';
import { environment } from '../environments/environment'
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  public customLayout: boolean;
  appEnviornmentConfig:any = environment
  constructor(
    private layoutService: LayoutService,
    private titleService: Title,
    private router: Router
  ) {}

  ngOnInit() {
    this.layoutService.isCustomLayout.subscribe((value: boolean) => {
     // console.log('customLayout',this.customLayout)
      if (localStorage.getItem("loggedin-adminId")) {
        this.customLayout = false;
      }else{
        this.customLayout = true;
      }
      
    });
    this.setTitle()

    if (localStorage.getItem("loggedin-adminId")) {
      this.customLayout = false;
    }else{
      this.customLayout = true;
    }
    console.log('customLayout',this.customLayout)
    
  }

  setTitle(){
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route: ActivatedRoute = this.router.routerState.root;
          let routeTitle = '';
          while (route!.firstChild) {
            route = route.firstChild;
          }
          if (route.snapshot.data['title']) {
            routeTitle = route!.snapshot.data['title'];
          }
          return routeTitle;
        })
      )
      .subscribe((title: string) => {
        if (title) {
          this.titleService.setTitle(`${title}`);
        }
      });
  }
}
