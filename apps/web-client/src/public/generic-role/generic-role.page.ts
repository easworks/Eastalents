import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonFAQComponent } from '../common/faq/faq-lists.component';

@Component({
  standalone: true,
  selector: 'generic-role-page',
  templateUrl: './generic-role.page.html',
  styleUrl: './generic-role.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionModule,CommonFAQComponent]
})
export class GenericRolePageComponent {
  readonly panelOpenState = signal(false);
}
