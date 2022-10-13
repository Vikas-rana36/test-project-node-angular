import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SectionsComponent } from './sections/sections.component';
import { QuestionsComponent } from './questions/questions.component';



const routes: Routes = [
  {
    path: '',
    component: SectionsComponent,  
  },
  {
    path: 'sections',
    component: SectionsComponent,  
  },
  {
    path: 'questions',
    component: QuestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionnairesRoutingModule { }
