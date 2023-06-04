import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormImports, ImportsModule, LottiePlayerDirective } from '@easworks/app-shell';

@Component({
  selector: 'account-freelancer-sign-up-page',
  templateUrl: './freelancer-sign-up.page.html',
  styleUrls: ['./freelancer-sign-up.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImports,
    MatCheckboxModule
  ]
})
export class FreelancerSignUpPageComponent {
  @HostBinding()
  private readonly class = 'page grid lg:flex gap-4 justify-center';

  protected readonly form = new FormGroup({
    firstName: new FormControl('', {
      validators: [Validators.required],
      nonNullable: true
    }),
    lastName: new FormControl('', {
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
  })
}
