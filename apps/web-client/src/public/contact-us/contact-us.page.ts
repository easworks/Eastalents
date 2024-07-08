import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactFormComponent } from '@easworks/app-shell/common/contact-form/contact-form.component';

@Component({
  standalone: true,
  selector: 'contact-us-page',
  templateUrl: './contact-us.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ContactFormComponent
  ]
})
export class ContactUsPageComponent {

}
