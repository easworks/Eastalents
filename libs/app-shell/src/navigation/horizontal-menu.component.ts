import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'nav[horizontal-menu]',
  templateUrl: './horizontal-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHorizontalMenuComponent {

}