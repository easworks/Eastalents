import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormImportsModule } from '../common/form.imports.module';
import { ImportsModule } from '../common/imports.module';
import { AppHorizontalMenuComponent } from './horizontal-menu.component';
import { AppVerticalMenuComponent } from './vertical-menu.component';
import { AppNavMenuComponent } from './nav-menu.component';

@NgModule({
  declarations: [
    AppVerticalMenuComponent,
    AppNavMenuComponent,
    AppHorizontalMenuComponent
  ],
  imports: [
    ImportsModule,
    FormImportsModule,
    RouterModule
  ],
  exports: [
    AppVerticalMenuComponent,
    AppNavMenuComponent,
    AppHorizontalMenuComponent
  ]
})
export class NavigationModule { }