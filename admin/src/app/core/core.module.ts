import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoxModule, TabsModule, DropdownModule } from 'angular-admin-lte';
import { ToastrModule } from 'ng6-toastr-notifications';
/*import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxMaskModule, IConfig } from 'ngx-mask'*/

import { HeaderInnerComponent } from './components/header-inner/header-inner.component';
import { SidebarLeftInnerComponent } from './components/sidebar-left-inner/sidebar-left-inner.component';
import { SidebarRightInnerComponent } from './components/sidebar-right-inner/sidebar-right-inner.component';
import { FormValidationErrorsComponent } from './components/form-validation-errors/form-validation-errors.component';
import { PageLoaderComponent } from './components/page-loader/page-loader.component';
import { FirstLetterCapitalPipe } from './pipes/first-letter-capital.pipe';
import { ReadMoreComponent } from './components/read-more/read-more.component';
//export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

import { NgxPaginationModule } from 'ngx-pagination';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faChevronRight, faChevronDown } from  '@fortawesome/free-solid-svg-icons';
library.add(faChevronRight);
library.add(faChevronDown);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DropdownModule,
    TabsModule,
    BoxModule,
    ToastrModule.forRoot(),
    FontAwesomeModule,
    NgxPaginationModule,
    /*NgxDatatableModule,
    ImageCropperModule,
    NgxMaskModule.forRoot(),*/
  ],
  declarations: [
    HeaderInnerComponent, 
    SidebarLeftInnerComponent, 
    SidebarRightInnerComponent,
    FormValidationErrorsComponent, 
    PageLoaderComponent, 
    FirstLetterCapitalPipe,
    ReadMoreComponent
  ],
  exports: [ 
    /*ImageCropperModule, NgxDatatableModule, ToastrModule,*/ 
    BoxModule, 
    TabsModule, 
    HeaderInnerComponent, 
    SidebarLeftInnerComponent, 
    SidebarRightInnerComponent,
    FormValidationErrorsComponent, 
    PageLoaderComponent, 
    FirstLetterCapitalPipe, 
    ReadMoreComponent,
    NgxPaginationModule/*, NgxMaskModule*/
  ]
})
export class CoreModule { }
