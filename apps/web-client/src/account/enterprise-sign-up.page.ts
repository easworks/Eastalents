import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormImports, ImportsModule } from '@easworks/app-shell';

@Component({
  selector: 'account-enterprise-sign-up-page',
  templateUrl: './enterprise-sign-up.page.html',
  styleUrls: ['./enterprise-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImports,
    MatCheckboxModule
  ]
})
export class EnterpriseSignUpPageComponent {
  @HostBinding()
  private readonly class = 'page grid grid-cols-10 gap-4';

  protected readonly form = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    lastName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    company: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true
    }),
    password: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    confirmPassword: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    tncAgreement: new FormControl(false, {
      validators: [Validators.requiredTrue],
      nonNullable: true
    })
  }, {
    validators: [
      (c) => {
        const isMatch = c.value.password === c.value.confirmPassword;
        if (isMatch)
          return null;
        else
          return { passwordMismatch: true }
      }
    ],
    updateOn: 'submit'
  });
}
