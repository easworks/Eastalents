import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatRippleModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  exports: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ]
})
export class NavigationModule { }