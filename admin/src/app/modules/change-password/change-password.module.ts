import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ChangePasswordRoutingModule } from './change-password-routing.module';

@NgModule({
  declarations: [
    ChangePasswordComponent,
  ],
  imports: [
    CommonModule,
    ChangePasswordRoutingModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  
})
export class ChangePasswordModule { }

