import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GamePageComponent } from '../game-page/game-page.component';

export const routes: Routes = [{ path: '', component: GamePageComponent }];

@NgModule({
  declarations: [GamePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes)],
})
export class GamePageModule {}
