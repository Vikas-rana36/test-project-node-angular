import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoryComponent } from './category/category.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CategoriesRoutingModule } from './categories-routing.module';
import { CoreModule } from '../../core/core.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    CategoryComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    CoreModule,
    CategoriesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule
  ]
})
export class CategoriesModule { }
