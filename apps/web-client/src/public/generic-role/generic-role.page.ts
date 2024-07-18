import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'generic-role-page',
  templateUrl: './generic-role.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class GenericRolePageComponent {

}
