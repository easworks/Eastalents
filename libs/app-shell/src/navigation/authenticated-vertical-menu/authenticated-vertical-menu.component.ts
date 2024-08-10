import { ArrayDataSource } from '@angular/cdk/collections';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { LetDirective } from '@ngrx/component';
import { Store } from '@ngrx/store';
import { navMenuFeature } from '../../state/nav-menu';
import { MenuItem } from '../models';

@Component({
  standalone: true,
  selector: 'authenticated-vertical-menu',
  templateUrl: './authenticated-vertical-menu.component.html',
  styleUrl: './authenticated-vertical-menu.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontAwesomeModule,
    CdkTreeModule,
    RouterModule,
    LetDirective
  ]
})
export class AuthenticateVerticalMenuComponent {
  private readonly store = inject(Store);

  protected readonly icons = {
    faChevronDown
  } as const;

  protected readonly state$ = this.store.selectSignal(navMenuFeature.selectAllowed);

  protected readonly search$ = computed(() => {
    const allowed = this.state$().ordered;

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

  protected readonly tree = (() => {
    const control = new NestedTreeControl<MenuItem>(item => item.children);

    const dataSource$ = computed(() => new ArrayDataSource(this.search$()));

    const hasChild = (_: number, node: MenuItem) => !!(node.children?.length);

    return { control, dataSource$, hasChild } as const;
  })();
}

