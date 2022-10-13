import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CoreModule } from '../../core/core.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SectionsComponent } from './sections/sections.component';
import { QuestionsComponent } from './questions/questions.component';
import { QuestionnairesRoutingModule } from './questionnaires-routing.module';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    SectionsComponent,
    QuestionsComponent
  ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    CommonModule,
    QuestionnairesRoutingModule,
    NgxDropzoneModule,
    CKEditorModule
  ]
})
export class QuestionnairesModule { }
