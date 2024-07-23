import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { HelpGroup } from '@easworks/app-shell/services/help';
import { FAQGroup, FAQListComponent } from '../common/faq-list.component';
// import { FeaturedDomainsComponent } from '../common/featured-domains.component';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

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
    // FeaturedDomainsComponent
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

  protected readonly icons = {
    faCheck
  } as const;

  protected readonly faqs$ = signal<FAQGroup[]>([]);

  protected readonly whyJoin = [
    {
      lottie: 'https://assets5.lottiefiles.com/packages/lf20_xoih8e2r.json',
      title: 'We see the person and the engineer',
      content: 'You are more than your resume and deserve a dedicated Enterprise Application Platform to share your skills and do what you love.'
    },
    {
      lottie: 'https://assets1.lottiefiles.com/packages/lf20_4ufjcjnn.json',
      title: 'Grow your client base',
      content: 'We give you the ideal platform to build a client base without too much effort so that you can form long-lasting professional relationships in the enterprise software field.'
    },
    {
      lottie: 'https://assets8.lottiefiles.com/packages/lf20_ssmd5ixl.json',
      title: 'We match your paycheck with your experience and skill set',
      content: 'Find the right opportunity at a salary that reflects your expertise and skills, with room for additional benefits via Deel.'
    },
    {
      lottie: 'https://assets1.lottiefiles.com/packages/lf20_mlfv646z.json',
      title: 'We work with you',
      content: 'We believe in working with each other and not for each other. We work with you to identify the client role with the best overall fit, catering to your work schedule, tech stacks, and team dynamics among other factors.'
    },
    {
      lottie: 'https://assets1.lottiefiles.com/packages/lf20_6ln47dih.json',
      title: 'You\'ll never get bored',
      content: 'We work with innovative companies around the world and match our consultants with enterprise projects they\'re passionate about.'
    },
    {
      lottie: 'https://assets9.lottiefiles.com/packages/lf20_eqez4yrv.json',
      title: 'We value our freelancers and clients equally',
      content: 'We give our freelancers full transparency around the vetting and hiring process to ensure all parties are on the same page when it comes to how we work.'
    }
  ];

  protected readonly youChoose = [
    'The Enterprise task/project doesn\'t seem challenging enough?',
    'Didn\'t click with the client?',
    'Expection is higher for the compensation paid?'
  ];

}
