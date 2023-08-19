import { NgModule } from '@angular/core';
import { PlayerComponent } from './player.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [PlayerComponent],
  imports: [CommonModule],
  exports: [PlayerComponent],
})
export class PlayerModule {}
