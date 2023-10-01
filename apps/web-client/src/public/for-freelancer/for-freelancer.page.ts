import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { HelpGroup } from '@easworks/app-shell/services/help';
import { FAQGroup, FAQListComponent } from '../common/faq-list.component';
import { FeaturedDomainsComponent } from '../common/featured-domains.component';

@Component({
  standalone: true,
  selector: 'for-freelancer-page',
  templateUrl: './for-freelancer.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    MatExpansionModule,
    FAQListComponent,
    FeaturedDomainsComponent
  ]
})
export class ForFreelancerPageComponent {

  constructor() {
    const route = inject(ActivatedRoute);

    route.data.pipe(takeUntilDestroyed())
      .subscribe(d => {
        const helpGroups = d['help'] as HelpGroup[];
        this.faqs$.set(helpGroups.map(hg => ({
          name: hg.title,
          items: hg.items.map(i => ({
            question: i.title,
            content: i.content
          }))
        })));
      });
  }

  protected readonly faqs$ = signal<FAQGroup[]>([]);

}
