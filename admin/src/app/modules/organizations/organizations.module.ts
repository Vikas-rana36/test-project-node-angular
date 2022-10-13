import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { OrganizationsRoutingModule } from './organizations-routing.module';
import { OrganizationComponent } from './organization/organization.component';
import { CoreModule } from '../../core/core.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';

@NgModule({
  declarations: [
    OrganizationComponent,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    CoreModule,
    OrganizationsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    NgxIntlTelInputModule
  ]
})
export class OrganizationsModule { }
