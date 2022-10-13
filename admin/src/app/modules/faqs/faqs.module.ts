import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FaqsRoutingModule } from './faqs-routing.module';
import { FaqComponent } from './faq/faq.component';
import { CoreModule } from '../../core/core.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    FaqComponent,
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    CoreModule,
    FaqsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ]
})
export class FaqsModule { }
