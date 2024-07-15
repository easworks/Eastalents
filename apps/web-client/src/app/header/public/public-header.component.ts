import { ChangeDetectionStrategy, Component } from '@angular/core';
import { publicMenu } from '../../menu-items/public';

@Component({
  standalone: true,
  selector: 'app-public-header',
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: []
})
export class AppPublicHeaderComponent {

  protected readonly menuItems = publicMenu.main;
}