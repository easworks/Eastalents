import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { pattern } from '@easworks/models';

@Component({
  standalone: true,
  selector: 'contact-us-page',
  templateUrl: './contact-us.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    ImportsModule,
    FormImportsModule
  ]
})
export class ContactUsPageComponent {
  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    email: new FormControl('', {
      validators: [Validators.required, Validators.pattern(pattern.email)],
      nonNullable: true
    }),
    subject: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    message: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
  }, {
    updateOn: 'submit'
  });
}
