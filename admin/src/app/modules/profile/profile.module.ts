import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { CKEditorModule } from 'ckeditor4-angular';
import { NgxDropzoneModule } from 'ngx-dropzone';


@NgModule({
  declarations: [
    UpdateProfileComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    ProfileRoutingModule,
    CKEditorModule,
    NgxDropzoneModule
  ]
})
export class ProfileModule { }
