import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { AppVerticalMenuComponent } from './vertical-menu.component';

@NgModule({
  declarations: [
    AppVerticalMenuComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    MatDividerModule
  ],
  exports: [
    AppVerticalMenuComponent
  ]
})
export class NavigationModule { }