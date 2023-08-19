import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { GamePageComponent } from '../game-page/game-page.component';
import { PlayerModule } from 'src/app/components/player/player.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { StadiumModule } from 'src/app/components/stadium/stadium.module';
import { ScoreModule } from 'src/app/components/score/score.module';

export const routes: Routes = [{ path: '', component: GamePageComponent }];

@NgModule({
    declarations: [GamePageComponent],
    imports: [CommonModule, RouterModule.forChild(routes), PlayerModule, SharedModule, StadiumModule, ScoreModule]
})
export class GamePageModule {}
