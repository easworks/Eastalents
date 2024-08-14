import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CrossValidationDirective } from './cross-validate.directive';
import { FormFieldDirective } from './form-field.directive';
import { ResubmitIfPendingDirective } from './resubmit-if-pending.directive';

// TODO: rename this
export const FormImportsModule = [
  FormsModule,
  ReactiveFormsModule,
  FormFieldDirective,
  CrossValidationDirective,
  ResubmitIfPendingDirective,
];

export {
  CrossValidationDirective, FormFieldDirective, ResubmitIfPendingDirective
};

