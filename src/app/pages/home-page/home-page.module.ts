import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { CenterLayoutModule } from 'src/app/components/layout/center-layout/center-layout.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlayerInputModule } from 'src/app/components/input/player-input/player-input.module';

export const routes: Routes = [{ path: '', component: HomePageComponent }];

@NgModule({
    declarations: [HomePageComponent],
    imports: [CommonModule, RouterModule.forChild(routes), SharedModule, CenterLayoutModule, PlayerInputModule]
})
export class HomePageModule {}
