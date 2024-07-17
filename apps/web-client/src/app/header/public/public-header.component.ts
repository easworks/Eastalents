import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { publicMenu } from '../../menu-items/public';
import { RouterModule } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { faHighTechFourLeaf } from 'custom-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatRippleModule } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { sidebarActions } from '@easworks/app-shell/state/ui';

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

  protected readonly menuItems = publicMenu.main;

  protected toggleSidebar() {
    this.store.dispatch(sidebarActions.toggleExpansion());
  }
}