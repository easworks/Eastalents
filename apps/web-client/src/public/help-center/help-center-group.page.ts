import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { HelpGroup } from './data';

@Component({
  standalone: true,
  selector: 'help-center-group-page',
  templateUrl: './help-center-group.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule
  ]
})
export class HelpCenterGroupPageComponent {
  constructor() {
    this.listenToRouteChanges();
  }

  protected readonly group$ = signal<HelpGroup>({
    title: '',
    slug: '',
    link: '',
    items: []
  });

  private readonly fragment$ = signal<string | null>(null);

  private listenToRouteChanges() {
    const route = inject(ActivatedRoute);

    route.data.pipe(takeUntilDestroyed())
      .subscribe(d => {
        this.group$.set(d['group']);
      });

    route.fragment.pipe(takeUntilDestroyed())
      .subscribe(f => this.fragment$.set(f || null));
  }
}
