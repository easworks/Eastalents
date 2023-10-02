import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { DomainState } from '@easworks/app-shell/state/domains';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { DomainModule } from '@easworks/models';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { DomainSoftwareSelectorComponent } from '../common/domain-software-selector.component';
import { FeaturedDomainsComponent } from '../common/featured-domains.component';
import { UseCaseTilesContainerComponent } from '../common/use-case-tiles-container.component';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FeaturedDomainsComponent,
    UseCaseTilesContainerComponent,
    DomainSoftwareSelectorComponent,
    MatSelectModule,
    FormsModule,
    RouterModule
  ]
})
export class HomePageComponent {
  private readonly domainState = inject(DomainState);

  protected readonly icons = {
    faAngleRight
  } as const;

  protected readonly customerLogos = [
    'client-1.png',
    'client-2.png',
    'client-3.png',
    'client-4.png',
    'client-5.png',
    'client-1.png',
  ].map(v => `/assets/img/${v}`);

  protected readonly promises = [
    {
      lottie: 'https://lottie.host/cdcfdf4a-7f11-46f6-b763-8aa0ddd63cb3/5cIAv6Pb81.json',
      title: 'Flexibility',
      content: `Enables on-demand workforce, accessing global talent, 
        finding specialized skills, adapting to project needs, and 
        optimizing resource utilization, providing agility in resource allocation.`
    },
    {
      lottie: 'https://lottie.host/3203c356-64e8-4201-863e-81282f3506c9/PlX4Ox852r.json',
      title: 'Cost-Effectiveness',
      content: `Transform your cost structure by harnessing the skills of a
        diverse and adept multidisciplinary team that exceeds expectations 
        while adhering to your budget.`
    },
    {
      lottie: 'https://lottie.host/7da03309-6e31-4baa-992a-7ee702e4e819/6HgdujnMus.json',
      title: 'Accountability',
      content: `Foster accountability through a quality assurance process 
        that combines technological tools and human interaction to evaluate 
        and monitor talents work.`
    },
    {
      lottie: 'https://lottie.host/57b08bd3-d2c8-40a4-a671-9eace5cb0f6a/gmVxmaKxh2.json',
      title: 'Business Value',
      content: `Expertise and Specialization: Enterprise Application Freelancers 
        with deep knowledge and experience.`
    },
    {
      lottie: 'https://lottie.host/0ab10ae7-b278-4ff2-93c7-12c5702845ba/DyAyVPgYMt.json',
      title: 'Speed',
      content: `Ensure proposals from relevant EAS experts within 48 hours,
        allowing employers to quickly connect with and engage talents.`
    },
  ];

  protected readonly howItWorks = [
    {
      lottie: 'https://lottie.host/5bf7837c-438a-4a4e-a94d-7a36e8b9562a/cMaf4XaF50.json',
      title: 'Describe your needs',
      content: `Brief us on your Enterprise Application, technology, domain, 
        enterprise project requirements and describe your project using our job form.`
    },
    {
      lottie: 'https://lottie.host/3a6e85a5-efa3-4b74-8850-f8595245abd1/gfULmGWGsu.json',
      title: 'Schedule a meeting to align on goals',
      content: `We always create a unique team augmentation strategy based on business goals`
    },
    {
      lottie: 'https://lottie.host/e53c1145-18b9-42c3-9dd5-30ba9473df9e/XmL6zR3gAz.json',
      title: 'Interview & Approve',
      content: `Interview the EAS talent that we match you with and approve the 
        candidate(s) who will join your enterprise project team.`
    },
    {
      lottie: 'https://lottie.host/f707add6-d1ed-49db-b0d2-224e018b4dca/4LiVNG5Um8.json',
      title: 'Start your Enterprise project with remote talent',
      content: `Seal the deal with a contract based on your engagement model and 
        launch your remote team.`
    }
  ];

  protected readonly accelerate = [
    {
      lottie: 'https://lottie.host/cdcfdf4a-7f11-46f6-b763-8aa0ddd63cb3/5cIAv6Pb81.json',
      title: 'Vetted Individuals',
      content: `Bridge the EAS Skill Gap in Your Team with our pre-vetted EAS professionals 
        who bring the enterprise application expertise and the skill set you're looking for.`
    },
    {
      lottie: 'https://assets2.lottiefiles.com/packages/lf20_kcovw7lp.json',
      title: 'Full Teams',
      content: `Hire a fully equipped remote team on a per-project basis with needed EAS
        skills, ready to start immediately.`
    },
    {
      lottie: 'https://assets6.lottiefiles.com/packages/lf20_agykieqg.json',
      title: 'Enterprise Application Projects',
      content: `EASWORKS platform allows us to pull from the elite global enterprise
        application talent to create a hand-picked AND fully managed team to reliably deliver on your enterprise project within your budget and deadlines.`
    }
  ];



  protected readonly roleList = this.initRoleList();

  private initRoleList() {
    const list$ = computed(() => this.domainState.domains.list$()
      .map(domain => {
        const modules = [
          null,
          ...domain.modules
        ];

        const selectedModule$ = signal<DomainModule | null>(null);

        const roles$ = computed(() => {
          const m = selectedModule$();
          if (m)
            return m.roles;
          return [...new Set(domain.modules.flatMap(d => d.roles))]
            .sort(sortString);

        });

        return {
          name: domain.longName,
          key: domain.key,
          modules,
          selectedModule$,
          roles$
        };
      }));

    const loading$ = computed(() => list$().length === 0);

    return { list$, loading$ };
  }
}
