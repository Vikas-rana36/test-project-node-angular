import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { CoreModule } from '../../core/core.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent,ForgotPasswordComponent,ResetPasswordComponent]
})
export class LoginModule { }
