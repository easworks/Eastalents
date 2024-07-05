import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Store } from '@ngrx/store';
import { navMenuFeature, sortNavMenu } from '../../state/nav-menu';
import { MenuItem } from '../models';

@Component({
  standalone: true,
  selector: 'authenticated-vertical-menu',
  templateUrl: './authenticated-vertical-menu.component.html',
  styleUrl: './authenticated-vertical-menu.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class AuthenticateVerticalMenuComponent {
  private readonly store = inject(Store);

  protected readonly state$ = this.store.selectSignal(navMenuFeature.selectNavMenuState);

  private readonly allowed$ = computed(() => {
    const state = this.state$();

    const itemIds = new Set<string>();

    state.list.forEach(item => {
      const allowed = true;

      if (allowed)
        itemIds.add(item.id);

      let parent = item.parent;
      while (parent) {
        if (itemIds.has(parent))
          break;
        itemIds.add(parent);
        parent = state.map[parent]?.id;
      }
    });

    const allowed = [...itemIds]
      .sort(sortNavMenu.ids(state.order))
      .map(i => state.map[i]);

    return allowed;
  });

  protected readonly search$ = computed(() => {
    const allowed = this.allowed$();

    const items: MenuItem[] = [];
    const map: Record<string, MenuItem> = {};

    for (const item of allowed) {
      const view: MenuItem = {
        ...item
      };
      map[item.id] = view;

      if (item.parent) {
        const parent = map[item.parent];
        parent.children ||= [];
        parent.children.push(view);
      }
      else {
        items.push(view);
      }

    }

    return items;
  });
}

