import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'telephone-form',
  templateUrl: './telephone-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TelephoneFormComponent {

}
