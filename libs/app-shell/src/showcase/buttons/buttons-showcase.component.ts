import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { faEdit, faPencil } from '@fortawesome/free-solid-svg-icons';
import { ImportsModule } from '../../common/imports.module';

@Component({
  standalone: true,
  selector: 'buttons-showcase',
  templateUrl: './buttons-showcase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class ButtonsShowcaseComponent {
  @HostBinding()
  private readonly class = 'block';

  protected readonly icons = {
    faPencil
  } as const;
}