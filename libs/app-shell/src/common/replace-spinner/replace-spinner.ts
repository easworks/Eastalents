import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'replace-spinner',
  templateUrl: './replace-spinner.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatProgressSpinnerModule
  ]
})
export class ReplaceSpinnerComponent {
  @HostBinding('class') readonly class = 'relative block';
  @Input() showSpinner = false;
  @Input() diameter = 18;

  @Input() spinnerClasses = '[&_circle]:stroke-primary';

  @Input() contentContainerStyle: any = {
    display: 'grid',
    justifyContent: 'center',
    alignContent: 'center',
  };
}
