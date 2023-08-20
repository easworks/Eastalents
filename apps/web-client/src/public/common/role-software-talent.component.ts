import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'role-software-talent',
  templateUrl: './role-software-talent.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleSoftwareTalentComponent {
  @Input({ required: true }) comboText!: string;
}
