import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, computed, inject } from '@angular/core';
import { NavMenuState, UiState } from '../state';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHorizontalMenuComponent {
  private readonly hostElement = inject(ElementRef).nativeElement as HTMLElement;

  @HostBinding()
  private readonly class = 'flex items-center';
  private readonly menuState = inject(NavMenuState);
  protected readonly uiState = inject(UiState);

  protected readonly menuItems$ = computed(() => {
    // TODO: make this react to auth changes
    const isPublic = true;

    if (isPublic) {
      return this.menuState.publicMenu.horizontal$();
    }
    else
      return [];
  });

  private readonly collapseClass = 'collapse-all';

  unfocus() {
    this.uiState.updateTouchDetection();
    (document.activeElement as HTMLElement).blur();
  }

  collapseAll() {
    this.hostElement.classList.add(this.collapseClass);
    // double nesting it to skip one animation frame
    // skipping one animation frame guarantees that the menu has closed
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.hostElement.classList.remove(this.collapseClass);
      })
    });
  }
}