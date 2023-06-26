import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrossValidationDirective } from './cross-validate.directive';
import { FormFieldDirective } from './form-field.directive';
import { ResubmitIfPendingDirective } from './resubmit-if-pending.directive';

@NgModule({
  imports: [
    FormFieldDirective,
    CrossValidationDirective,
    ResubmitIfPendingDirective
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    FormFieldDirective,
    CrossValidationDirective,
    ResubmitIfPendingDirective
  ]

})
export class FormImportsModule { }
