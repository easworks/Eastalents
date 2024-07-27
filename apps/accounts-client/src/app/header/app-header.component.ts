import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { AccountWidgetComponent } from "../../account/account-widget/account.widget";

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    AccountWidgetComponent
  ]
})
export class AppHeaderComponent {
  @HostBinding()
  private readonly class = 'flex h-full gap-4 items-center p-1 px-4';

}