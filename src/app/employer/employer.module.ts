import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EmployerOnboardingComponent } from './onboarding/onboarding.page';

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
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class EmployerModule { }