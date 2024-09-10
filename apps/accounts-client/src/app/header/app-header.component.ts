import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { sidebarActions, uiFeature } from '@easworks/app-shell/state/ui';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { AccountWidgetComponent } from "../../account/account-widget/account.widget";

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    AccountWidgetComponent,
    RouterModule
  ]
})
export class AppHeaderComponent {
  private readonly store = inject(Store);

  @HostBinding()
  private readonly class = 'flex bg-white h-full gap-4 items-center p-1 px-4';

  protected readonly icons = {
    faBars
  } as const;

  protected toggleSidebar() {
    this.store.dispatch(sidebarActions.toggleExpansion());
  }
}