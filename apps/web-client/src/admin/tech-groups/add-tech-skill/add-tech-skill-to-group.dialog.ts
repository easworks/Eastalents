import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialog, MatDialogClose } from '@angular/material/dialog';
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

  public static open(dialog: MatDialog) {
    dialog.open(AddTechSkillToGroupDialogComponent);
  }
}