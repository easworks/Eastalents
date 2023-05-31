import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployerOnboardingComponent } from './onboarding/onboarding.page';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'onboarding',
    pathMatch: 'full',
    component: EmployerOnboardingComponent
  }
]

@NgModule({
  declarations: [
    EmployerOnboardingComponent
  ],
  imports: [
    RouterModule.forChild(routes),

    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployerModule { }