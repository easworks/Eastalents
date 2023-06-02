import { ChangeDetectionStrategy, Component, HostBinding, computed, inject } from '@angular/core';
import { NavMenuState } from './state';

@Component({
  selector: 'nav[horizontal-menu]',
  templateUrl: './horizontal-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHorizontalMenuComponent {

  @HostBinding()
  private readonly class = 'flex gap-2 items-center';
  private readonly menuState = inject(NavMenuState);

  protected readonly public$ = computed(() => true);
  protected readonly publicMenu$ = this.menuState.publicMenu.horizontal$;

}