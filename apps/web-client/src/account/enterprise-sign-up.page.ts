import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AccountApi, FormImports, ImportsModule } from '@easworks/app-shell';
import { pattern } from '@easworks/models';

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

  private readonly api = {
    account: inject(AccountApi)
  };

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
      validators: [Validators.required, Validators.pattern(pattern.email)],
      asyncValidators: [
        async (c) => {
          const value = c.value as string;
          const blacklisted = await this.api.account.blackListedDomains();
          if (blacklisted.some(d => value.endsWith(d)))
            return { blacklisted: true };
          return null;
        }
      ],
      nonNullable: true
    }),
    password: new FormControl('', {
      validators: [Validators.required, Validators.pattern(pattern.password)],
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
