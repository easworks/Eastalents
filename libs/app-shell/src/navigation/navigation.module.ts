import { NgModule } from '@angular/core';
import { FormImports, ImportsModule } from '../imports.module';
import { AppHorizontalMenuComponent } from './horizontal-menu.component';
import { AppVerticalMenuComponent } from './vertical-menu.component';

@NgModule({
  declarations: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ],
  imports: [
    ImportsModule,
    FormImports
  ],
  exports: [
    AppVerticalMenuComponent,
    AppHorizontalMenuComponent
  ]
})
export class NavigationModule { }