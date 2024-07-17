import { ChangeDetectionStrategy, Component, HostBinding, computed, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { MenuItem } from '@easworks/app-shell/navigation/models';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

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

  public readonly publicItems$ = input.required<MenuItem[]>({ alias: 'public' });
  public readonly staticItems$ = input.required<MenuItem[]>({ alias: 'static' });
  public readonly aboutItems$ = input.required<MenuItem[]>({ alias: 'about' });
  public readonly socialItems$ = input.required<MenuItem[]>({ alias: 'social' });

  protected readonly showPublicMenu$ = computed(() => this.publicItems$().length > 0);

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