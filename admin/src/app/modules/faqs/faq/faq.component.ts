import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { UtilsService } from '../../../core/services';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {ColumnMode, SelectionType} from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myTable') table: any;
  filteredItems: any = [];
  loadingIndicator = false;
  noRecords = false;
  dataList:any = [];
  columns: Array<any>;
  // itemsPerBatch = 200;
  offset = 0;
  isLoadMore: boolean;
  noMoreRecords: boolean;
  filterObj: any = {};
  searchArray: any;
  // totalCount: number;
  tableData:any = [];
  rows:any = [];
  selected:any = [];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  allDeleted:boolean = false;
  faqForm: FormGroup;
  formStatus:string = 'Add'
  isFormSubmitted:boolean = false;
  isCollapsed:boolean = true;
  currentPage: number = 1;
  totalRecords: number = 0;
  itemsPerPage : number = 10;
  start : number;
  last : number;


  constructor(private utilsService: UtilsService, private formBuilder:FormBuilder, private renderer: Renderer2) { 
    this.renderer.listen('window', 'click',(e)=>{
      if(e.path[1].className === 'box-tools pull-right' || e.path[1].className === 'btn btn-box-tool'){      
        this.isCollapsed=false;
      }
    });
  }

  ngOnInit(): void {
    this._fetchListing()
    this._initColumns()
    this._initalizeForm()
  }

  _initalizeForm(){
    this.faqForm=this.formBuilder.group({     
      id:[null], 
      question: [null, [Validators.required]],
      answer: [null, [Validators.required]],      
      is_active: [true],
    })
  }
  _initColumns() {    
    this.columns = [       
      { name: 'Action', prop: 'Action', width: 110, visible: true, sortable: false},  
      { name: 'Question', prop: 'question', width: 250, visible: true, sortable: true },
      { name: 'Answer', prop: 'answer', width: 250, visible: true, sortable: true },
      { name: 'Status', prop: 'is_active', width: 150, visible: true, sortable: false },   
      { name: 'Created On', prop: 'created', width: 250, visible: true, sortable: true, type: 'date' },
      { name: 'Updated On', prop: 'updated', width: 250, visible: true, sortable: true, type: 'date' },
    ];  
  }

  _fetchListing(filter:any=""){
    let apiURL:any="";
    this.utilsService.showPageLoader('Fetching Records');//show page loader
    if(filter){
      apiURL = '/faq/listing?search="search"&page='+this.currentPage;
    }else{
      apiURL = '/faq/listing?page='+this.currentPage;
    }
    this.utilsService.processPostRequest(apiURL,filter).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {
      this.totalRecords = results.count;
      this.last         = this.currentPage * this.itemsPerPage;
      if (this.last > this.totalRecords) {
        this.last = this.totalRecords;
      }
      results = results.data || []    
      results = this._prepareJobData(results)
    
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
            //obj['active'] = (item.is_active)?'Yes':'No'                   
            obj['created'] = item.createdAt ? this._changeTimeZone(item.createdAt, '','') : '', 
            obj['updated'] = item.updatedAt ? this._changeTimeZone(item.updatedAt, '','') : '',            
            preparedData.push(obj);
        });
    }
    return preparedData;
  }

  _changeTimeZone(value:any, timeZone:any, timeZoneAbbr:any) {
    const timeFormat = 'MM/DD/YYYY'   
    const dateFormated = timeZoneAbbr ? this.utilsService.dateFormate(value, timeZone, timeFormat) :this.utilsService.dateFormate(value, timeZone, timeFormat);
    return dateFormated
  }

  get formRef(){
    return this.faqForm.controls;
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

  cancelEdit(){
    this.faqForm.reset();
    this.isCollapsed = true;
    this.formStatus = 'Add'
    this.faqForm.patchValue({is_active:true});
    console.log('value',this.faqForm.value);
  }

  onSubmit(){
    this.isCollapsed = false;
    if (this.faqForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/faq/add',this.faqForm.value).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      this.isCollapsed = true;
      console.log(this.isCollapsed)
      this.cancelEdit()
      this._fetchListing()
    })
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

  /**
   * To filter out result based on user input in one of the coloumn of listing.
   * @param event | To determine if method is called from control or from another method.
   * @param type | To determine which type of input is recieved.
   */
   /*filter(event?, type?) {    
    this.tableData = this.data.filter((item) => {
      const notMatchingField = Object.keys(this.filterObj).find((key) =>
        this._utilityService.dataTableSearch(item, this.filterObj, key)
      );
      return !notMatchingField;
    });    
    this.setEmptyMessage();
  }*/

  

  /*Data Table funcation start here*/
  loadMoreRecords() {
    /*this.isLoadMore = true;
    if (this.dataList.length <= this.itemsPerBatch) {
        this.getListing(this.searchArray, this.itemsPerBatch);
    } else {
        this.getListing(this.searchArray, this.dataList.length);
    }*/
  }

  onSelect(event:any) {
    //console.log('Select Event', event.selected, this.selected);
    this.selected.splice(0, this.selected.length);
    this.selected.push(...event.selected);
  }

  onBtnClicked(){
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',      
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        let catIds:any = [];
        this.selected.forEach((selectedcats:any) =>{
          if(selectedcats && selectedcats._id){
            catIds.push(selectedcats._id)
          } 
        })
        //console.log("cats>>>>>>>>>>>>>>>",catIds)
        this.utilsService.processPostRequest('/faq/deleteSelected',{id:catIds}).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-DELETED']); 
            this.allDeleted = true;
            this.__deleteSelectResetList(catIds)
          }else{
            Swal.fire('Sorry...', environment.MESSAGES['CAN-NOT-DELETE'], 'error')
          }
        }),
        this.utilsService.hidePageLoader();//hide page loader
      }
    })  
  }

  delete(record:any){

    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this record!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',      
    }).then((result) => {
      if (result.value) {
        this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/faq/delete',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-DELETED']); 
            this._deleteResetList(record)
          }else{
            Swal.fire('Sorry...', environment.MESSAGES['CAN-NOT-DELETE'], 'error')
            return false;
          }
          
        })
      } 
    })    
  }

  private _deleteResetList(record:any) {
    this.tableData = this.tableData.filter((newitem:any) => newitem._id != record._id);
    // this.totalCount--;
  }

  private __deleteSelectResetList(recordsIds:any){
    recordsIds.forEach((element:any) => {
      this.tableData = this.tableData.filter((newitem:any) => newitem._id != element);
      // this.totalCount--;
    });
  }

  edit(record:any){
    // console.log(record)
     this.faqForm.patchValue({ id: record._id})
     this.faqForm.patchValue({ question: record.question})
     this.faqForm.patchValue({ answer: record.answer})
     this.formStatus = 'Update';
     this.isCollapsed = false;
   }
   cancel(){
    this.faqForm.reset();
    this.faqForm.patchValue({ id: null, is_active:true})
    this.isCollapsed = true;
    this.formStatus = 'Add'
  }
  onChaneStatus(event:any, row:any) {
    
    console.log("chk event><>>>>>>>>",event)

    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/faq/changeStatus',{id:row._id, status:row.is_active?false:true}).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
          if(response){
            this.utilsService.onSuccess(environment.MESSAGES['STATUS-UPDATED']);           
          }else{
            Swal.fire('Sorry...', environment.MESSAGES['SYSTEM-ERROR'], 'error')
            return false;
          }
          
        })
  }

}
