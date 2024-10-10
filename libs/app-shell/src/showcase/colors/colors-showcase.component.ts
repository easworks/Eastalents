import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ImportsModule } from '../../common/imports.module';

@Component({
  standalone: true,
  selector: 'buttons-showcase',
  templateUrl: './colors-showcase.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class ColorsShowcaseComponent {

  @HostBinding()
  private readonly class = 'block bg-surface-container text-on-surface rounded-md';

  protected readonly icons = {
    faEdit
  } as const;
}