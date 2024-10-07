import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { HelpCategory } from '@easworks/app-shell/services/help';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'help-center-page',
  templateUrl: './help-center.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    ImportsModule,
    RouterModule,
    MatTabsModule
  ]
})
export class HelpCenterPageComponent {

  constructor() {
    const route = inject(ActivatedRoute);

    route.data.pipe(takeUntilDestroyed()).subscribe(d => {
      this.categories$.set(d['categories']);
    });
  }

  @HostBinding()
  private readonly class = '';

  protected readonly icons = {
    faCircleArrowRight
  } as const;

  protected readonly categories$ = signal<HelpCategory[]>([]);

}

