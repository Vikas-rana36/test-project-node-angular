import { Component, OnInit, ViewChild } from '@angular/core';
import { UtilsService } from '../../../core/services';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { ExcelService } from '../../../core/services/excel.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myTable') table: any;
  columns: Array<any>;
  noRecords = false;
  isActivated = false;
  offset = 0;
  filteredItems: any = [];
  dataList:any = [];
  isLoadMore: boolean;
  filterObj: any = {};
  tableData:any = [];
  loadingIndicator = false;
  currentPage: number = 1;
  totalRecords: number = 0;
  itemsPerPage : number = 10;
  start : number;
  last : number;
  organizations:any = [];
  users: [];

  constructor(private utilsService: UtilsService, private excelService: ExcelService) {
    this.excelService = excelService;
  }

  ngOnInit(): void {
    this._fetchOrganizations()
    this._fetchListing()
    this._initColumns()
  }

  _initColumns() {    
    this.columns = [ 
      { name: 'First Name', prop: 'first_name', pipe: { transform: this.titleCaseWord }, width: 220, visible: true, sortable: true },
      { name: 'Last Name', prop: 'last_name', pipe: { transform: this.titleCaseWord }, width: 200, visible: true, sortable: true },
      { name: 'Email', prop: 'email', width: 250, visible: true, sortable: true },   
      { name: 'Gender', prop: 'gender', width: 150, pipe: { transform: this.titleCaseWord }, visible: true, sortable: false, type: 'select_gender' },
      { name: 'Organization', prop: 'organization', width: 150, pipe: { transform: this.titleCaseWord }, visible: true, sortable: false, type: 'select_org' },
      { name: 'Status', prop: 'is_active', width: 100, visible: true, sortable: true },
      { name: 'Last Logged In', prop: 'lastLoggedIn', width: 100, visible: true, sortable: true, type: 'date' },
      { name: 'Created On', prop: 'created', width: 200, visible: true, sortable: true, type: 'date' },
      { name: 'Updated On', prop: 'updated', width: 200, visible: true, sortable: true, type: 'date' },
    ];  
  }

  _fetchOrganizations(){
    this.utilsService.processPostRequest('/organization/listing',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {  
      this.organizations = results.data || []
    })
  }

  _fetchListing(filter:any=""){
    let apiURL:any="";
    this.utilsService.showPageLoader('Fetching Records');//show page loader
    if(filter){
      apiURL = '/user/listing?search="search"&page='+this.currentPage;
    }else{
      apiURL = '/user/listing?page='+this.currentPage;
    }
    this.utilsService.processPostRequest(apiURL,filter).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {
      this.totalRecords = results.count;
      this.last         = this.currentPage * this.itemsPerPage;
      if (this.last > this.totalRecords) {
        this.last = this.totalRecords;
      }
      results     = results.data || []
      results     = this._prepareJobData(results)
      this.users  = this._prepareExcelData(results);

      if (this.isLoadMore) {
          this.dataList = this.dataList.concat(results);
      } else {
          this.dataList = results;
      }
      this.dataList = [...this.dataList];            
      this.filteredItems = this.dataList.slice();
      if (Object.keys(this.filterObj).length > 0 && this.filterObj.constructor === Object) {
        this.tableData = this.filteredItems.filter((item:any) => {
            const notMatchingField = Object.keys(this.filterObj).find(key =>
                this.utilsService.dataTableSearch(item, this.filterObj, key));
            return !notMatchingField;
        });
      } else {
          this.tableData = this.dataList;
      } 
      this.tableData = this.dataList;
      console.log('tableData',this.tableData);
      this.loadingIndicator = false;
      this.setEmptyMessage();    
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  _prepareExcelData(data:any) {
    const preparedExcelData:any = [];
    if (data) {
        data.forEach((item:any) => {  
          let obj : any = {};
            obj['First Name'] = item.first_name
            obj['Last Name'] = item.last_name
            obj['Email'] = item.email
            obj['Gender'] = item.gender
            obj['Organization'] = item.organization
           
            preparedExcelData.push(obj);
        });
    }
    return preparedExcelData;
  }

  pageChangeEvent(count: number){
    this.currentPage  = count;
    this.start        = count * this.itemsPerPage - (this.itemsPerPage-1);
    this.last         = count * this.itemsPerPage;
    if (this.last > this.totalRecords) {
      this.last = this.totalRecords;
    }
    this._fetchListing(this.filterObj);
  }

  _prepareJobData(data:any) {
    const preparedData:any = [];
    if (data) {
        let obj;
        data.forEach((item:any) => {  
            obj = item
            obj['deleted'] = (item.is_deleted)?'Yes':'No'
            obj['organization'] = item.organization[0].name 
            obj['created'] = item.createdAt ? this._changeTimeZone(item.createdAt, '','') : '', 
            obj['updated'] = item.updatedAt ? this._changeTimeZone(item.updatedAt, '','') : '', 
            obj['lastLoggedIn'] = item.last_login ? this._changeTimeZone(item.updatedAt, '','') : '', 
            
            preparedData.push(obj);
        });
    }
    return preparedData;
  }

  /**
   * To set error message on table if there is no data avaible to show.
   */
   // To set data table Empty message
   setEmptyMessage() {
    const msg = 'No data to display.';
    if (!this.tableData.length) {
      this.tableData = [{
        'message': msg
      }];
      this.tableData[0][this.columns[0]['prop']] = msg;
    } else {
      if (this.tableData[0].hasOwnProperty('message')) {
        this.tableData.shift();
      }
    }
  }

  _changeTimeZone(value:any, timeZone:any, timeZoneAbbr:any) {
    const timeFormat = 'MM/DD/YYYY'   
    const dateFormated = timeZoneAbbr ? this.utilsService.dateFormate(value, timeZone, timeFormat) :this.utilsService.dateFormate(value, timeZone, timeFormat);
    return dateFormated
  }

  filterData(event:any, type:any) {
    if (type === 'date') {
        if (event.value === '') {
            if (this.filterObj[event.input.id + '_temp']) {
                delete this.filterObj[event.input.id];
            }
        } else {
          this.filterObj[event.input.id] = this.utilsService.dateFormate(event.value, '', 'MM/DD/YYYY')
        }      
    } else if (type === 'select_gender') {
      if (event.target.value === '') {
          delete this.filterObj[event.currentTarget.id];
      } else {
          this.filterObj[event.currentTarget.id] = event.target.value;
      }
    } else if (type === 'select_org') {
      if (event.target.value === '') {
          delete this.filterObj[event.currentTarget.id];
      } else {
          this.filterObj[event.currentTarget.id] = event.target.value;
      }
    } else {
        if (event.target.value === '') {
            delete this.filterObj[event.currentTarget.id];
        } else {
            this.filterObj[event.currentTarget.id] = event.target.value;
        }
    }
    this._fetchListing(this.filterObj);

    if (this.table) {
        this.table['offset'] = 0
    }
    this.setEmptyMessage();
  }
  

  clearSearch(col:any) {
    this.filterObj[col] = ''
    this._fetchListing(this.filterObj);
  }

  onChaneStatus(event:any, row:any) {
    console.log("chk event><>>>>>>>>",event)
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/user/changeStatus',{id:row._id, status:row.is_active?false:true}).pipe(takeUntil(this.destroy$)).subscribe((response) => {
      if(response){
        this.utilsService.onSuccess(environment.MESSAGES['STATUS-UPDATED']);           
      }else{
        Swal.fire('Sorry...', environment.MESSAGES['SYSTEM-ERROR'], 'error');
        return false;
      }
    })
  }

  titleCaseWord(word: string) {
    if (!word) return word;
    return word[0].toUpperCase() + word.substr(1).toLowerCase();
  }

  exportToExcel() {
    this.excelService.exportAsExcelFile(this.users, 'users');
  }

}
