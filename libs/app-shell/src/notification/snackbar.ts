import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { ProblemDetails } from 'models/problem-details';

@Component({
  selector: 'common-snackbar',
  templateUrl: './snackbar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class SnackbarComponent {
  protected data = inject<{
    message: string;
  }>(MAT_SNACK_BAR_DATA) ?? {
    message: 'Hello There!'
  };

  static forSuccess(snackbar: MatSnackBar) {
    snackbar.openFromComponent(SnackbarComponent, SuccessSnackbarDefaults);
  }

  static forError(snackbar: MatSnackBar, error?: unknown) {
    if (error instanceof ProblemDetails) {
      snackbar.openFromComponent(this, {
        ...ErrorSnackbarDefaults,
        data: {
          message: error.type
        }
      });
    }
    else if (error instanceof Error) {
      snackbar.openFromComponent(this, {
        ...ErrorSnackbarDefaults,
        data: {
          message: error.message
        }
      });
    }
    else {
      snackbar.openFromComponent(this, {
        ...ErrorSnackbarDefaults,
      });
    }
  }
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
