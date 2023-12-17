import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

export interface FAQ {
  question: string;
  content: string[];
}

export interface FAQGroup {
  name: string;
  items: FAQ[];
}

@Component({
  standalone: true,
  selector: 'faq-list',
  templateUrl: './faq-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatExpansionModule
  ]
})
export class FAQListComponent {
  @HostBinding() private readonly class = 'block';
  @Input({ required: true }) faqs: FAQ[] = [];
  @Input() expand: number = -1;
}
