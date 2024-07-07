import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';

interface TechGroupSkillsDialogData {
  group: string;
}

@Component({
  standalone: true,
  selector: 'tech-group-skills-dialog',
  templateUrl: './tech-group-skills.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechGroupSkillsDialogComponent {
  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: TechGroupSkillsDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
  }
}