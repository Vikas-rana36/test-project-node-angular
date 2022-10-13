import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserComponent } from './user/user.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { UsersRoutingModule } from './users-routing.module';
import { CoreModule } from '../../core/core.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ExcelService } from '../../core/services/excel.service';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    UsersRoutingModule,
    CoreModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [ExcelService],
})
export class UsersModule { }
