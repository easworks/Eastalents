import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FormImports, ImportsModule } from '@easworks/app-shell';
import { pattern } from '@easworks/models';

@Component({
  selector: 'account-sign-in-page',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImports,
    RouterModule
  ]
})
export class AccountSignInPageComponent {
  @HostBinding()
  private readonly class = 'page grid';

  protected readonly emailLogin = {
    form: new FormGroup({
      email: new FormControl('', {
        validators: [Validators.required, Validators.pattern(pattern.email)],
        nonNullable: true
      }),
      password: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true
      })
    }, { updateOn: 'submit' })
  }
}