import { ChangeDetectionStrategy, Component, HostBinding, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { HelpGroup } from '@easworks/app-shell/services/help';
import { faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'help-center-page',
  templateUrl: './help-center.page.html',
  styleUrls: ['./help-center.page.less'],
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

    // route.data.pipe(takeUntilDestroyed()).subscribe(d => {
    //   this.employer$.set(mapItemsForHelpCenter(d['employer'], 'employer'));
    //   this.freelancer$.set(mapItemsForHelpCenter(d['freelancer'], 'freelancer'));
    // });
  }

  @HostBinding()
  private readonly class = 'page';

  protected readonly icons = {
    faCircleArrowRight
  } as const;

  protected readonly employer$ = signal([] as MappedHelpGroup[]);
  protected readonly freelancer$ = signal([] as MappedHelpGroup[]);
}

function mapItemsForHelpCenter(groups: HelpGroup[], category: string) {
  const mapped = groups.map(g => ({
    ...g,
    link: `/help-center/${category}/${g.slug}`,
    rowSpan: Math.ceil(g.items.length / 2)
  }));

  return mapped;
}

type MappedHelpGroup = ReturnType<typeof mapItemsForHelpCenter>[number];
