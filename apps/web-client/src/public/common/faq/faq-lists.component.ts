import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  standalone: true,
  selector: 'faq-lists',
  templateUrl: './faq-lists.component.html',
  styleUrl: './faq-lists.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule]
})
export class CommonFAQComponent {
  readonly panelOpenState = signal(false);
}
