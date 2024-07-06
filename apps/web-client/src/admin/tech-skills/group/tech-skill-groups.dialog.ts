import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DialogLoaderComponent } from '@easworks/app-shell/common/dialog-loader.component';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { TechSkill } from '../../models/tech-skill';

interface AddTechSkillToGroupDialogData {
  skill: TechSkill;
}

@Component({
  standalone: true,
  selector: 'tech-skill-groups-dialog',
  templateUrl: './tech-skill-groups.dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatDialogModule
  ]
})
export class TechSkillGroupsDialogComponent {
  protected readonly icons = {
    faXmark
  } as const;

  public static open(ref: MatDialogRef<DialogLoaderComponent>, data: AddTechSkillToGroupDialogData) {
    DialogLoaderComponent.replace(ref, this, data);
  }
}