import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

@Component({
  standalone: true,
  selector: 'client-profile-contact-form',
  templateUrl: './contact-info-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule
  ]
})
export class ClientProfileContactFormComponent {
  @HostBinding()
  private readonly class = 'block @container';
}