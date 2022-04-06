import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GaugeChartModule } from 'angular-gauge-chart';
import { ToastrModule } from 'ngx-toastr';
import { EmploerQuestionComponent } from './emploer-question.component';
import { EmployerSelectItemComponent } from './employer-select-item/employer-select-item.component';
import { DatafilterPipe } from './datafilter.pipe';

const routes: Routes = [
  {
    path: '',
    component: EmploerQuestionComponent,

  }
];

@NgModule({
  declarations: [EmploerQuestionComponent, EmployerSelectItemComponent, DatafilterPipe],
  imports: [
    CommonModule,
    FormsModule,
    GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes)
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class EmploerQuestionModule { }
