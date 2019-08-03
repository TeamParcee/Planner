import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FromNowPipe } from './from-now.pipe';
import { AddTimePipe } from './add-time.pipe';

@NgModule({
  declarations: [FromNowPipe, AddTimePipe],
  imports: [
    CommonModule
  ],exports: [FromNowPipe, AddTimePipe]
})
export class PipesModule { }
