import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { HelpGroup } from './data';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'help-center-page',
  templateUrl: './help-center.page.html',
  styleUrls: ['./help-center.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LottiePlayerDirective,
    ImportsModule,
    RouterModule
  ]
})
export class HelpCenterPageComponent {

  constructor() {
    const route = inject(ActivatedRoute);

    route.data.pipe(takeUntilDestroyed()).subscribe(d => {
      this.employer$.set(hydrateLinksForHelpCenter(d['employer'], 'employer'));
      this.freelancer$.set(hydrateLinksForHelpCenter(d['freelancer'], 'freelancer'));
    });
  }

  @HostBinding()
  private readonly class = 'page';

  protected readonly icons = {
    faCircleArrowRight
  } as const;

  protected readonly employer$ = signal([] as HelpGroup[]);
  protected readonly freelancer$ = signal([] as HelpGroup[]);
}

function hydrateLinksForHelpCenter(groups: HelpGroup[], category: string) {
  groups.forEach(g => {
    g.link = `/help-center/${category}/${g.slug}`;
  });

  return groups;
}
