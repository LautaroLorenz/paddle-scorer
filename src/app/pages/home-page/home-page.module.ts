import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { HomePageComponent } from './home-page.component';
import { CenterLayoutModule } from 'src/app/components/layout/center-layout/center-layout.module';

export const routes: Routes = [{ path: '', component: HomePageComponent }];

@NgModule({
  declarations: [HomePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), CenterLayoutModule],
})
export class HomePageModule {}
