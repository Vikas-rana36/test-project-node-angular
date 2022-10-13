import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, ActivatedRoute } from "@angular/router";
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//services
import { AuthService, UtilsService } from '../../../core/services';
import { environment } from '../../../../environments/environment';
import { CustomValidators } from '../../../core/custom-validators';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  destroy$: Subject<boolean> = new Subject<boolean>();
  resetPasswordForm: FormGroup;
  submitted:boolean = false;
  token : any = "";

  constructor(private formBuilder: FormBuilder, private router: Router, private utilsService:UtilsService, private authService:AuthService, private activatedRoute: ActivatedRoute) {
    this.utilsService.checkAndRedirect();
  }

  ngOnInit() {
    this._initalizeResetPasswordForm();
    this.activatedRoute.params.subscribe(params => {
      this.token = params['token'];
    });
  }

  private _initalizeResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$")]],
      confirm_new_password: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}$")]]
    },
    {
      validator: CustomValidators.passwordMatchValidator('password', 'confirm_new_password')
    });
  }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.submitted = true    
      return
    }
    let resetPasswordFormData = this.resetPasswordForm.value;
    resetPasswordFormData['token'] = this.token;
    console.log(resetPasswordFormData)
    this.utilsService.showPageLoader(environment.MESSAGES["CHECKING-AUTHORIZATION"]);//show page loader

    this.utilsService.processPostRequest('/auth/resetPassword',resetPasswordFormData).pipe(takeUntil(this.destroy$)).subscribe((response:any) => {   
      console.log(response)
      this.utilsService.onSuccess('Password Updated successfully.');         
      this.router.navigate(['/auth/login']);
      this.utilsService.hidePageLoader();//hide page loader
    })
  }

  get formRef(){
    return this.resetPasswordForm.controls;
  }
  
}

