import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatRipple,
    MatSnackBarModule
  ],
  template: `
  <div class="flex items-center gap-4">
    <p>Thank you for reaching out to us. We'll get back to you shortly.</p>
    <button class="shaded-button bg-transparent text-black hover:bg-black/10 focus:bg-black/10"
    mat-ripple
    (click)="snackbar.dismissWithAction()">OK</button>
  </div>
  `
})
export class ContactFormAcknowledgementComponent {
  protected readonly snackbar = inject(MatSnackBarRef);

  static open(snackbar: MatSnackBar) {
    snackbar.openFromComponent(ContactFormAcknowledgementComponent, {
      panelClass: ['success-snackbar', 'with-actions'],
      duration: 15000,
    });
  }

}