import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UtilsService } from '../../../core/services'
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.css']
})
export class UpdateProfileComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  @ViewChild('myTable') table: any;
  profileForm: FormGroup;
  formStatus:string = 'Update'
  isFormSubmitted:boolean = false;
  isCollapsed:boolean = false;
  files: File[] = [];
  fileUrl:string = "";
  fileNotUploaded:boolean = true;
  uploadedImage: SafeResourceUrl;
  styleAlreadyUploadedImage = "none";
  styleNewImage = "none";

  constructor(private utilsService: UtilsService, private formBuilder:FormBuilder, private sanitizer: DomSanitizer) { 
  
  }

  ngOnInit(): void {
    this._fetchData()
    this._initalizeForm()
  }

  _initalizeForm(){
    this.profileForm=this.formBuilder.group({     
      id:[null], 
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
    })
  }
  
  _fetchData(){
    let adminId : any;
    adminId = localStorage.getItem("loggedin-adminId");
    let postData = {
      'userID' : adminId
    }
    this.utilsService.showPageLoader('Fetching Records');//show page loader
    this.utilsService.processPostRequest('/auth/adminInfo',postData).pipe(takeUntil(this.destroy$)).subscribe((results:any) => {   
      results = results.data || []
      this.profileForm.patchValue({ id: results._id})
      this.profileForm.patchValue({ first_name: results.first_name})
      this.profileForm.patchValue({ last_name: results.last_name})
      this.uploadedImage = this.sanitizer.bypassSecurityTrustResourceUrl(results.profile_pic);
      if(this.uploadedImage){
        this.styleNewImage = 'none';
        this.styleAlreadyUploadedImage = 'block';
      }
      this.fileUrl = results.profile_pic;
      this.fileNotUploaded = false;
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  get formRef(){
      return this.profileForm.controls;
  }
 
  cancelEdit(){
    this.profileForm.reset();
    this.formStatus = 'Update'
  }

  onSubmit(){
    if (this.profileForm.invalid) {     
      this.isFormSubmitted= true
      return false;      
    }

    let profileFormData = this.profileForm.value;
    this.styleNewImage = 'none';
    profileFormData['profile_pic'] = this.fileUrl;
    this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
    this.utilsService.processPostRequest('/auth/editAdmin',profileFormData).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
      this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      this.cancelEdit()
      this._fetchData()
    })
  }

  onFileSelect(event:any) {
    this.styleAlreadyUploadedImage = "none";
    this.styleNewImage = "block";
    this.files = event.addedFiles;

    if (this.files && this.files[0]) {		
      const formData = new FormData(); 
      formData.append("file", this.files[0], this.files[0].name);
      this.utilsService.showPageLoader(environment['MESSAGES']['SAVING-INFO']);//show page loader
      this.utilsService.processPostRequest('/upload/uploadFile',formData).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {
        this.fileNotUploaded = false;
        if(this.uploadedImage){
          this.styleAlreadyUploadedImage = "none";
        }
        this.fileUrl = response.data.file_location;
        this.utilsService.onSuccess(environment.MESSAGES['SUCCESSFULLY-SAVED']); 
      })
      
    }else{
      console.log('Only Image file is accepted.')
    }
  }

  onFileRemove(event:any) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  removeAlreadyUploadedFile(){
    this.styleAlreadyUploadedImage = "none";
  }

}


