import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GaugeChartModule } from 'angular-gauge-chart';
import { ToastrModule } from 'ngx-toastr';
import { TalentProfileViewComponent } from './talent-profile-view.component';

const routes: Routes = [
  {
    path: '',
    component: TalentProfileViewComponent,

  }
];

@NgModule({
  declarations: [TalentProfileViewComponent],
  imports: [
    CommonModule,
    FormsModule,
    GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes)
  ]
})
export class TalentProfileViewModule { }
