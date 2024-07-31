import { ChangeDetectionStrategy, Component, computed, HostBinding, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { AuthService } from '@easworks/app-shell/services/auth';
import { SWManagerService } from '@easworks/app-shell/services/sw.manager';
import { sidebarActions } from '@easworks/app-shell/state/ui';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleArrowUp } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { faHighTechFourLeaf } from 'custom-icons';
import { RETURN_URL_KEY } from 'models/auth';
import { PUBLIC_MENU } from '../../menu-items/public';

@Component({
  standalone: true,
  selector: 'app-public-header',
  templateUrl: './public-header.component.html',
  styleUrl: './public-header.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    MatDividerModule,
    FontAwesomeModule,
    MatRippleModule,
    MatTooltipModule
  ]
})
export class AppPublicHeaderComponent {
  private readonly store = inject(Store);
  private readonly swm = inject(SWManagerService);
  private readonly auth = inject(AuthService);

  @HostBinding()
  private readonly class = 'flex h-full gap-4 items-center bg-black p-1 px-4';

  protected readonly icons = {
    faHighTechFourLeaf,
    faCircleArrowUp
  } as const;

  private readonly publicMenu$ = inject(PUBLIC_MENU);

  protected readonly menuItems$ = computed(() => this.publicMenu$().horizontal);

  protected readonly sw = {
    hidden$: computed(() => !this.swm.updateAvailable$()),
    updating$: computed(() => this.swm.updating$()),
    update: () => {
      this.swm.wb.then(wb => wb?.messageSkipWaiting());
    }
  } as const;

  protected toggleSidebar() {
    this.store.dispatch(sidebarActions.toggleExpansion());
  }

  protected signIn() {
    const state = {
      [RETURN_URL_KEY]: location.pathname + location.search
    };
    const state64 = btoa(JSON.stringify(state));
    this.auth.signIn.easworks(state64);
  }
}