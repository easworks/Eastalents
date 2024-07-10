import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactFormComponent } from '@easworks/app-shell/common/contact-form/contact-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'contact-us-page',
  templateUrl: './contact-us.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContactFormComponent,
    FontAwesomeModule
  ]
})
export class ContactUsPageComponent {
  protected readonly icons = {
    faCircleInfo
  } as const;

}
