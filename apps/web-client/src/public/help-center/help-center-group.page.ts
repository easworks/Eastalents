import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

@Component({
  standalone: true,
  selector: 'help-center-group-page',
  templateUrl: './help-center-group.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class HelpCenterGroupPageComponent { }
