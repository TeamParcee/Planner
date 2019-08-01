import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PracticePlanPage } from './practice-plan.page';
import { DatePickerModule } from 'ionic4-date-picker'
const routes: Routes = [
  {
    path: '',
    component: PracticePlanPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePickerModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PracticePlanPage]
})
export class PracticePlanPageModule {}
