import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NavMenuState } from './state';

@Component({
  selector: 'nav[horizontal-menu]',
  templateUrl: './horizontal-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHorizontalMenuComponent {

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

}