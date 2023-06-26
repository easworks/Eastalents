import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormImportsModule } from '../common/form.imports.module';
import { ImportsModule } from '../common/imports.module';
import { AppHorizontalMenuComponent } from './horizontal-menu.component';
import { AppVerticalMenuComponent } from './vertical-menu.component';

@NgModule({
  declarations: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ],
  imports: [
    ImportsModule,
    FormImportsModule,
    RouterModule
  ],
  exports: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ]
})
export class NavigationModule { }