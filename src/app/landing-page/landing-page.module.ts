import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { LandingPageComponent } from './landing-page.component';


const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
  },
];

@NgModule({
  declarations: [LandingPageComponent],
  imports: [
    CommonModule,
    FormsModule,
    // GaugeChartModule,
    ReactiveFormsModule,
    ToastrModule,
    RouterModule.forChild(routes),
  ],
})
export class LandingModule {}
