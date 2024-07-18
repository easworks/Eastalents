import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'generic-role-page',
  templateUrl: './generic-role.page.html',
  styleUrl: './generic-role.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class GenericRolePageComponent {

}
