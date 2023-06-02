import { ChangeDetectionStrategy, Component, HostBinding, computed, inject } from '@angular/core';
import { NavMenuState } from './state';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHorizontalMenuComponent {

  @HostBinding()
  private readonly class = 'flex items-center';
  private readonly menuState = inject(NavMenuState);

  protected readonly menuItems$ = computed(() => {
    // TODO: make this react to auth changes
    const isPublic = true;

    if (isPublic) {
      return this.menuState.publicMenu.horizontal$();
    }
    else
      return [];
  });

  unfocus() {
    (document.activeElement as HTMLElement).blur();
  }
}