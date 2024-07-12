import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-authenticated-header',
  templateUrl: './authenticated-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class AppAuthenticatedHeaderComponent {

}