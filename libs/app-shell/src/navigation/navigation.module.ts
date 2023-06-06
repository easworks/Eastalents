import { NgModule } from '@angular/core';
import { FormImports, ImportsModule } from '../imports.module';
import { AppHorizontalMenuComponent } from './horizontal-menu.component';
import { AppVerticalMenuComponent } from './vertical-menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ],
  imports: [
    ImportsModule,
    FormImports,
    RouterModule
  ],
  exports: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ]
})
export class NavigationModule { }