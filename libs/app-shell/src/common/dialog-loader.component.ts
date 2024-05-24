import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';

@Component({
  standalone: true,
  selector: 'dialog-loader',
  template: `
  <mat-spinner mode=indeterminate diameter="24"></mat-spinner>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatProgressSpinnerModule
  ]
})
export class DialogLoaderComponent {

  @HostBinding() private readonly class = '!block p-2';

  public static async wrap(dialog: MatDialog, task: () => Promise<void>) {
    const ref = dialog.open(DialogLoaderComponent, { disableClose: true });
    try {
      await task();
    }
    finally {
      ref.close();
    }
  }

}