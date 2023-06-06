import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'common-snackbar',
  templateUrl: './snackbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class SnackbarComponent {
  protected data = inject<{
    message: string
  }>(MAT_SNACK_BAR_DATA) ?? {
    message: 'Hello There!'
  };
}
export const ErrorSnackbarDefaults: MatSnackBarConfig = {
  ...new MatSnackBarConfig(),
  panelClass: 'error-snackbar',
  duration: 3000,
  data: {
    message: 'An error has occured. Please try again.'
  }
};

export const SuccessSnackbarDefaults: MatSnackBarConfig = {
  ...new MatSnackBarConfig(),
  panelClass: 'success-snackbar',
  duration: 3000,
  data: {
    message: 'Success!'
  }
};
