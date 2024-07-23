import { ChangeDetectionStrategy, Component, HostBinding, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { PUBLIC_MENU, publicMenu } from '../../menu-items/public';

@Component({
  standalone: true,
  selector: 'public-sidebar',
  templateUrl: './public-sidebar.component.html',
  styleUrls: ['./public-sidebar.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    RouterModule
  ]
})
export class PublicSidebarComponent {

  @HostBinding()
  private readonly class = 'grid gap-4 p-4';

  protected readonly icons = { faAngleDown } as const;

  private readonly publicMenu$ = inject(PUBLIC_MENU);

  protected readonly dynamicItems$ = computed(() => this.publicMenu$().vertical);

  protected readonly staticItems = publicMenu.static;
  protected readonly aboutItems = publicMenu.about;
  protected readonly socialItems = publicMenu.social;

  protected readonly showDynamicItems$ = computed(() => this.dynamicItems$().length > 0);

  toggleOpen(listItem: HTMLLIElement) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const shouldAdd = !listItem.classList.contains('open');

    if (shouldAdd) {
      listItem.classList.add('open');
    }
    else {
      listItem.classList.remove('open');
    }
  }
}