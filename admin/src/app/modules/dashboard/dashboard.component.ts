import { Component, OnInit } from '@angular/core';
import { UtilsService } from '../../core/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  totalOrganizations: any = 0;
  totalCategories: any = 0;
  totalUsers: any = 0;
  totalSections: any = 0;
  totalQuestions: any = 0;
  totalFaqs: any = 0;
  url:string = "";

  constructor(private utilsService: UtilsService,) { }

  ngOnInit(): void {
    this._fetchDashboardData();
  }

  _fetchDashboardData(){
    this.utilsService.processPostRequest('/organization/fetchCount',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {  
      this.totalOrganizations = results.count;
    })

    this.utilsService.processPostRequest('/category/fetchCount',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {  
      this.totalCategories = results.count;
    })

    this.utilsService.processPostRequest('/section/fetchCount',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {  
      this.totalSections = results.count;
    })

    this.utilsService.processPostRequest('/question/fetchCount',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {  
      this.totalQuestions = results.count;
    })

    this.utilsService.processPostRequest('/user/fetchCount',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {  
      this.totalUsers = results.count;
    })

    this.utilsService.processPostRequest('/faq/fetchCount',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {  
      this.totalFaqs = results.count;
    })
  }

}
