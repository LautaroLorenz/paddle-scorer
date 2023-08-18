import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScoreComponent } from './score.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    ScoreComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ScoreComponent
  ]
})
export class ScoreModule { }
