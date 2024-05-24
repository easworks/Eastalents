import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'add-tech-skill-to-group-dialog',
  templateUrl: './add-tech-skill-to-group.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogClose
  ]
})
export class AddTechSkillToGroupDialogComponent {
  protected readonly icons = {
    faXmark,
  } as const;

  public static open(ref: MatDialogRef<DialogLoaderComponent>) {
    DialogLoaderComponent.replace(ref, this);
  }
}