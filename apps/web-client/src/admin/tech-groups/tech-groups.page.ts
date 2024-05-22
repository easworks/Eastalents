import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormImportsModule } from '@easworks/app-shell/common/form.imports.module';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { } from '@easworks/app-shell/common/form.imports.module';

@Component({
  standalone: true,
  selector: 'tech-groups-page',
  templateUrl: './tech-groups.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    FormImportsModule
  ]
})
export class TechGroupsPageComponent {

}