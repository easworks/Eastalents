import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GaugeChartModule } from 'angular-gauge-chart';
import { ToastrModule } from 'ngx-toastr';
import { EmploerJobpostingViewComponent } from './emploer-jobposting-view.component';

const routes: Routes = [
  {
    path: '',
    component: EmploerJobpostingViewComponent,

  }
];

@NgModule({
  declarations: [EmploerJobpostingViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes)
  ]
})
export class EmploerJobpostingViewModule { }
