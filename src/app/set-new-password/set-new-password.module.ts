import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GaugeChartModule } from 'angular-gauge-chart';
import { ToastrModule } from 'ngx-toastr';
import { SetNewPasswordComponent } from './set-new-password.component';

const routes: Routes = [
  {
    path: '',
    component: SetNewPasswordComponent,
  },
];

@NgModule({
  declarations: [SetNewPasswordComponent],
  imports: [
    CommonModule,
    FormsModule,
    GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes),
  ],
})
export class SetNewPasswordModule {}
