import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppVerticalMenuComponent } from './vertical-menu.component';
import { MatRippleModule } from '@angular/material/core';

@NgModule({
  declarations: [
    AppVerticalMenuComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule
  ],
  exports: [
    AppVerticalMenuComponent
  ]
})
export class NavigationModule { }