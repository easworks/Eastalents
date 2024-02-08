import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

@Component({
  standalone: true,
  selector: 'admin-tech-skills-page',
  templateUrl: './tech-skills.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class TechSkillsPageComponent {



}
