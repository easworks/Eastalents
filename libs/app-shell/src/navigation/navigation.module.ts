import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { AppHorizontalMenuComponent } from './horizontal-menu.component';
import { AppVerticalMenuComponent } from './vertical-menu.component';

@NgModule({
  declarations: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ],
  imports: [
    CommonModule,
    MatRippleModule,
    MatDividerModule,
    MatRippleModule
  ],
  exports: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ]
})
export class NavigationModule { }