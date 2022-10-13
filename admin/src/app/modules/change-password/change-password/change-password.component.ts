import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//services
import { AuthService, UtilsService } from '../../../core/services';
import { environment } from '../../../../environments/environment';
import { CustomValidators } from '../../../core/custom-validators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  changePasswordForm: FormGroup;
  submitted:boolean = false;
  adminId : any = "";
  isFormSubmitted:boolean = false;
  isCollapsed:boolean = false;

  constructor(private formBuilder: FormBuilder, private router: Router, private utilsService:UtilsService, private authService:AuthService) {
  }

    ngOnInit() {
    this._initalizeChangePasswordForm();
  }

  private _initalizeChangePasswordForm() {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', [Validators.required]],
      Password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$")]],
      confirmNewPassword: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$")]]
    },
    {
      validator: CustomValidators.passwordMatchValidator('Password', 'confirmNewPassword')
    });
  }

  onSubmit() {
    console.log("valid vales>>>>>>>>>>>.",this.changePasswordForm)
    if (this.changePasswordForm.invalid) {     
      this.isFormSubmitted = true
      return false;      
    }
    this.adminId = localStorage.getItem("loggedin-adminId");

    let changePasswordFormData = this.changePasswordForm.value;
    changePasswordFormData['id'] = this.adminId;
    console.log(changePasswordFormData)
    this.utilsService.showPageLoader(environment.MESSAGES["CHECKING-AUTHORIZATION"]);//show page loader

    this.utilsService.processPostRequest('/auth/passwordChange',changePasswordFormData).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {   
      console.log(response)
      this.utilsService.onSuccess('Password Changed successfully.');         
      this.changePasswordForm.reset();
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  get formRef(){
    return this.changePasswordForm.controls;
  }

}

















