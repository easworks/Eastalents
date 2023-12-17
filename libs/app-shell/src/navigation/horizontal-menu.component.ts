import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, computed, inject } from '@angular/core';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { NavMenuState } from '../state/menu';
import { ACTIONS } from '../state/redux-signals';
import { UI_FEATURE } from '../state/ui';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppHorizontalMenuComponent {
  private readonly hostElement = inject(ElementRef).nativeElement as HTMLElement;
  private readonly menuState = inject(NavMenuState);
  private readonly actions$ = inject(ACTIONS);
  protected readonly ui = inject(UI_FEATURE);

  @HostBinding()
  private readonly class = 'flex items-center';


  protected readonly icons = { faAngleDown } as const;

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
  private readonly dark$ = computed(() => this.ui.selectors.topBar$().dark);
  protected readonly linkClass$ = computed(() => {
    const colors = this.dark$() ?
      'group-hover:bg-white/90 group-focus-within:bg-white/90 group-hover:text-black hover:!text-primary-500' :
      'group-hover:bg-slate-500/20 group-focus-within:bg-slate-500/20';

    return `text-sm ${colors}`;
  });


  unfocus() {
    this.actions$.dispatch(this.ui.actions.touchDevice.update());
    (document.activeElement as HTMLElement).blur();
  }

  collapseAll() {
    this.hostElement.classList.add(this.collapseClass);
    // double nesting it to skip one animation frame
    // skipping one animation frame guarantees that the menu has closed
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.hostElement.classList.remove(this.collapseClass);
      });
    });
  }
}