import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HomeTabComponent } from './home-tab.component';

@NgModule({
  declarations: [HomeTabComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: HomeTabComponent }]),
  ]
})

export class HomeTabModule { }
