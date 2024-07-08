import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface CreateSoftwareProductDialogData {
  created: (id: string) => void;
}

@Component({
  standalone: true,
  selector: 'create-software-product-dialog',
  templateUrl: './create-software-product.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogModule
  ]
})
export class CreateSoftwareProductDialogComponent {
  protected readonly icons = {
    faXmark,
  } as const;

  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: CreateSoftwareProductDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
  }
}