import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { SettingComponent } from './setting/setting.component';
import { SettingsRoutingModule } from './settings-routing.module';
import { CKEditorModule } from 'ckeditor4-angular';

@NgModule({
  declarations: [
    SettingComponent
  ],
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    SettingsRoutingModule,
    CKEditorModule
  ]
})
export class SettingsModule { }
