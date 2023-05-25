import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { GaugeChartModule } from 'angular-gauge-chart';
import { ToastrModule } from 'ngx-toastr';
import { QuesCongratulationComponent } from './ques-congratulation.component';

const routes: Routes = [
  {
    path: '',
    component: QuesCongratulationComponent,
  },
];

@NgModule({
  declarations: [QuesCongratulationComponent],
  imports: [
    CommonModule,
    FormsModule,
    // GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes),
  ],
})
export class QuesCongratulationModule {}
