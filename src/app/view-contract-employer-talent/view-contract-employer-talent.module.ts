import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GaugeChartModule } from 'angular-gauge-chart';
import { ToastrModule } from 'ngx-toastr';
import { ViewContractEmployerTalentComponent } from './view-contract-employer-talent.component';

const routes: Routes = [
  {
    path: '',
    component: ViewContractEmployerTalentComponent,
  },
];

@NgModule({
  declarations: [ViewContractEmployerTalentComponent],
  imports: [
    CommonModule,
    FormsModule,
    GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ViewContractEmployerTalentModule {}
