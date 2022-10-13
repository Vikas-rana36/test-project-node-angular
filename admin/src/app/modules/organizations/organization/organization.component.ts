import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from '../../../core/services'
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {ColumnMode, SelectionType} from '@swimlane/ngx-datatable';
import Swal from 'sweetalert2'
import { environment } from '../../../../environments/environment';
import { CountryISO, SearchCountryField } from "ngx-intl-tel-input";

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.css']
})
export class OrganizationComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myTable') table: any;
  filteredItems: any = [];
  loadingIndicator = false;
  noRecords = false;
  dataList:any = [];
  columns: Array<any>;
  offset = 0;
  isLoadMore: boolean;
  noMoreRecords: boolean;
  filterObj: any = {};
  searchArray: any;
  tableData:any = [];
  rows:any = [];
  selected:any = [];
  SelectionType = SelectionType;
  ColumnMode = ColumnMode;
  allDeleted:boolean = false;
  organizationForm: FormGroup;
  formStatus:string = 'Add'
  isFormSubmitted:boolean = false;
  isCollapsed:boolean = true;
  files: File[] = [];
  fileUrl:string = "";
  currentPage: number = 1;
  totalRecords: number = 0;
  itemsPerPage : number = 10;
  start : number;
  last : number;

  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];

  constructor(private utilsService: UtilsService, private formBuilder:FormBuilder) { 
    
  }

  ngOnInit(): void {
    this._fetchListing()
    this._initColumns()
    this._initalizeForm()
  }

  _initalizeForm(){
    this.organizationForm=this.formBuilder.group({     
      id:[null], 
      name: [null, [Validators.required]],
      address1: [null, [Validators.required]],
      address2: [],
      org_owner: [],
      org_email: ['', [Validators.email]],
      org_phone: [],
      is_active: [true],
    })
  }

  _initColumns() {    
    this.columns = [       
      { name: 'Action', prop: 'Action', width: 110, visible: true, sortable: false},  
      { name: 'Name', prop: 'name', width: 250, visible: true, sortable: true },
      { name: 'Address 1', prop: 'address1', width: 250, visible: true, sortable: true },
      { name: 'Address 2', prop: 'address2', width: 150, visible: true, sortable: false },   
      { name: 'Owner', prop: 'org_owner', width: 150, visible: true, sortable: false },   
      { name: 'Email', prop: 'org_email', width: 150, visible: true, sortable: false },   
      { name: 'Phone', prop: 'org_phone', width: 150, visible: true, sortable: false },   
      { name: 'Created On', prop: 'created', width: 250, visible: true, sortable: true, type: 'date' },
      { name: 'Updated On', prop: 'updated', width: 250, visible: true, sortable: true, type: 'date' },
    ];  
  }

  _fetchListing(filter:any=""){
    let apiURL:any="";
    this.utilsService.showPageLoader('Fetching Records');//show page loader
    if(filter){
      apiURL = '/organization/listing?search="search"&page='+this.currentPage;
    }else{
      apiURL = '/organization/listing?page='+this.currentPage;
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
    return this.organizationForm.controls;
  }

  filterData(event:any, type:any) {
    if (type === 'date') {
        if (event.value === '') {
            if (this.filterObj[event.input.id + '_temp']) {
                delete this.filterObj[event.input.id];
            }
        } else {
          this.filterObj[event.input.id] = this.utilsService.dateFormate(event.value, '', 'YYYY-MM-DD');
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
    this.organizationForm.reset();
    this.isCollapsed = true;
    this.formStatus = 'Add';
    this.organizationForm.patchValue({is_active:true});
  }

  onSubmit(){
    console.log(this.organizationForm.value.org_phone);
    // return;
    this.isCollapsed = false;
    if (this.organizationForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }
    let organizationFormData = this.organizationForm.value;
    organizationFormData['org_phone']   = this.organizationForm.value.org_phone.e164Number;
    organizationFormData['countryCode'] = this.organizationForm.value.org_phone.countryCode;
    organizationFormData['dialCode']    = this.organizationForm.value.org_phone.dialCode;

    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/organization/add',organizationFormData).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
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

  onSelect(event:any) {
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
        this.utilsService.processPostRequest('/organization/deleteSelected',{id:catIds}).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
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
        this.utilsService.processPostRequest('/organization/delete',{id:record._id}).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
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
    this.organizationForm.patchValue({ id: record._id})
    this.organizationForm.patchValue({ name: record.name})
    this.organizationForm.patchValue({ address1: record.address1})
    this.organizationForm.patchValue({ address2: record.address2})
    this.organizationForm.patchValue({ org_owner: record.org_owner})
    this.organizationForm.patchValue({ org_email: record.org_email})
    this.organizationForm.patchValue({ org_phone: record.org_phone})
    // var phone = record.org_phone.replace(record.dialCode, '');
    // this.organizationForm.patchValue({ org_phone: phone})
  
    this.formStatus = 'Update'
    this.isCollapsed = false;
  }
   
  cancel(){
    this.organizationForm.reset();
    this.organizationForm.patchValue({ id: null, is_active:true})
    
    this.isCollapsed = true;
    this.formStatus = 'Add'
  }

  onChaneStatus(event:any, row:any) {
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
        this.utilsService.processPostRequest('/organization/changeStatus',{id:row._id, status:row.is_active?false:true}).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
           if(response){
              this.utilsService.onSuccess(environment.MESSAGES['STATUS-UPDATED']);           
            }else{
              Swal.fire('Sorry...', environment.MESSAGES['SYSTEM-ERROR'], 'error')
              return false;
            }
        })
  }

}
