import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ContactFormComponent } from '@easworks/app-shell/common/contact-form/contact-form.component';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.less',
})
export class ContactUsComponent {

}
