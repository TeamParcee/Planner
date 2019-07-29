import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EditActivityPage } from './edit-activity.page';
import { QuillModule } from 'ngx-quill'

const routes: Routes = [
  {
    path: '',
    component: EditActivityPage
  }, {
    path: ':id',
    component: EditActivityPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuillModule.forRoot(),
    RouterModule.forChild(routes)
  ],
  declarations: [EditActivityPage]
})
export class EditActivityPageModule { }
