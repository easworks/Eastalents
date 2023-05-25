import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { GaugeChartModule } from 'angular-gauge-chart';
import { ToastrModule } from 'ngx-toastr';
import { ApplicationListComponent } from './application-list.component';

const routes: Routes = [
  {
    path: '',
    component: ApplicationListComponent,
  },
];

@NgModule({
  declarations: [ApplicationListComponent],
  imports: [
    CommonModule,
    FormsModule,
    // GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApplicationListModule {}
