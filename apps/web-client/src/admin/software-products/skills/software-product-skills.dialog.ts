import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface SoftwareProductSkillsDialogData {
  product: string;
}

@Component({
  standalone: true,
  selector: 'software-product-skills-dialog',
  templateUrl: './software-product-skills.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogModule
  ]
})
export class SoftwareProductSkillsDialogComponent {
  protected readonly icons = {
    faXmark,
  } as const;

  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: SoftwareProductSkillsDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
    ref.addPanelClass('w-full');
  }
}