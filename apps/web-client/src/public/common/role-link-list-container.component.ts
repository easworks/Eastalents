import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'role-link-list-container',
  templateUrl: './role-link-list-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoleLinkListContainerComponent {

}
