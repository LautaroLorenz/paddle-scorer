import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerInputComponent } from './player-input.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [
    PlayerInputComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    PlayerInputComponent
  ]
})
export class PlayerInputModule { }
