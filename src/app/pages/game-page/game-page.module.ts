import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GamePageComponent } from '../game-page/game-page.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StadiumModule } from 'src/app/components/stadium/stadium.module';

export const routes: Routes = [{ path: '', component: GamePageComponent }];

@NgModule({
    declarations: [GamePageComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule, StadiumModule]
})
export class GamePageModule {}
