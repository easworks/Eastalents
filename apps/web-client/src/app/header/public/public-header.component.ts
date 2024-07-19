import { ChangeDetectionStrategy, Component, computed, HostBinding, inject } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule } from '@angular/router';
import { sidebarActions } from '@easworks/app-shell/state/ui';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store } from '@ngrx/store';
import { faHighTechFourLeaf } from 'custom-icons';
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
    MatRippleModule
  ]
})
export class AppPublicHeaderComponent {
  private readonly store = inject(Store);

  @HostBinding()
  private readonly class = 'flex h-full gap-4 items-center bg-black p-1 px-4 overflow-clip';

  protected readonly icons = {
    faHighTechFourLeaf
  } as const;

  private readonly publicMenu$ = inject(PUBLIC_MENU);

  protected readonly menuItems$ = computed(() => this.publicMenu$().horizontal);

  protected toggleSidebar() {
    this.store.dispatch(sidebarActions.toggleExpansion());
  }
}