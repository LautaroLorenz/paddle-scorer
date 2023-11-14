import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StadiumComponent } from './stadium.component';
import { PlayerModule } from '../player/player.module';
import { ScoreModule } from '../score/score.module';



@NgModule({
  declarations: [
    StadiumComponent
  ],
  imports: [
    CommonModule,
    PlayerModule,
    ScoreModule
  ],
  exports: [
    StadiumComponent
  ]
})
export class StadiumModule { }
