import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from '../../../core/services'
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-settings',
    templateUrl: './setting.component.html',
    styleUrls: ['./setting.component.css']
})

export class SettingComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myTable') table: any;
  settingForm: FormGroup;
  formStatus:string = 'Update'
  isFormSubmitted:boolean = false;
  isCollapsed:boolean = false;
  constructor(private utilsService: UtilsService, private formBuilder:FormBuilder) { 
  
  }

  ngOnInit(): void {
    this._fetchData()
    this._initalizeForm()
  }

  _initalizeForm(){
    this.settingForm=this.formBuilder.group({     
      id:[null], 
      is_activate_subscriptions: [false],
      terms_and_conditions: [null, [Validators.required]],
      introduction_content: [null, [Validators.required]],      
      FAS_results_explanation: [null, [Validators.required]],      
      introduction_for_discovery: [null, [Validators.required]],      
      introduction_to_plan: [null, [Validators.required]],      
    })
  }
  
  _fetchData(){
    this.utilsService.showPageLoader('Fetching Records');//show page loader
    this.utilsService.processPostRequest('/settings/fetch',{}).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {   
      results = results.data || []
      results = results[0];
      this.settingForm.patchValue({ id: results._id})
      this.settingForm.patchValue({ terms_and_conditions: results.terms_and_conditions})
      this.settingForm.patchValue({ introduction_content: results.introduction_content})
      this.settingForm.patchValue({ FAS_results_explanation: results.FAS_results_explanation})
      this.settingForm.patchValue({ introduction_for_discovery: results.introduction_for_discovery})
      this.settingForm.patchValue({ introduction_to_plan: results.introduction_to_plan})
      this.settingForm.patchValue({ is_activate_subscriptions: results.is_activate_subscriptions})
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  get formRef(){
      return this.settingForm.controls;
  }
 
  cancelEdit(){
    this.settingForm.reset();
    this.formStatus = 'Update'
    this.settingForm.patchValue({is_activate_subscriptions:true});
    console.log('value',this.settingForm.value);
  }

  onSubmit(){
    if (this.settingForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/settings/save',this.settingForm.value).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      this.cancelEdit()
      this._fetchData()
    })
  }
 
  // cancel(){
  //   this.settingForm.reset();
  //   this.settingForm.patchValue({ id: null, is_active:true})
  //   this.formStatus = 'Update'
  // }

}

