import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  selector: 'enterprise-profile-edit-page',
  templateUrl: './profile-edit.page.html',
  styleUrls: ['./profile-edit.page.less'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FormImportsModule
  ]
})
export class EnterpriseProfileEditPageComponent {
  private readonly route = inject(ActivatedRoute);
  @HostBinding() private readonly class = 'flex flex-col lg:flex-row';

  protected readonly isNew = this.route.snapshot.queryParamMap.has('new');

  protected readonly form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(300)
      ]
    }),
    summary: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(1500)
      ]
    })
  })
}
