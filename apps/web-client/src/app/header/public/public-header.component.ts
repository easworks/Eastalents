import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-public-header',
  templateUrl: './public-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class AppPublicHeaderComponent {

}