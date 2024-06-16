import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, input } from '@angular/core';
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
  @HostBinding('class') private readonly class = 'contents relative';
  public readonly showSpinner$ = input.required<boolean>({ alias: 'showSpinner' });

  public readonly diameter$ = input(16, { alias: 'diameter' });

  public readonly spinnerClasses$ = input<string>('[&_circle]:stroke-primary', { alias: 'spinnerClass' });
}
