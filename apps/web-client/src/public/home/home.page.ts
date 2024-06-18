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

  protected readonly promises = [
    {
      lottie: 'https://lottie.host/cdcfdf4a-7f11-46f6-b763-8aa0ddd63cb3/5cIAv6Pb81.json',
      title: 'Flexibility',
      content: `Enable an on-demand workforce, access global talent, 
        find specialized skills, and adapt to project needs, 
        optimizing resource utilization for agile allocation.`
    },
    {
      lottie: 'https://lottie.host/3203c356-64e8-4201-863e-81282f3506c9/PlX4Ox852r.json',
      title: 'Cost-Effectiveness',
      content: `Transform your cost structure by leveraging a diverse, 
        skilled multidisciplinary team that delivers exceptional 
        results within your budget.`
    },
    {
      lottie: 'https://lottie.host/7da03309-6e31-4baa-992a-7ee702e4e819/6HgdujnMus.json',
      title: 'Accountability',
      content: `Enhance accountability with a quality assurance process 
        that uses technological tools and human oversight to evaluate
        and monitor talent performance.`
    },
    {
      lottie: 'https://lottie.host/57b08bd3-d2c8-40a4-a671-9eace5cb0f6a/gmVxmaKxh2.json',
      title: 'Business Value',
      content: `Gain expertise and specialization from Enterprise Application 
        talents with deep knowledge and experience.`
    },
    // {
    //   lottie: 'https://lottie.host/0ab10ae7-b278-4ff2-93c7-12c5702845ba/DyAyVPgYMt.json',
    //   title: 'Speed',
    //   content: `Get proposals from relevant EAS experts within 48 hours, 
    //     enabling quick connections and engagements with top talent`
    // },
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
      lottie: 'https://lottie.host/d1c2490c-af63-4ea7-a623-0b51dd9764ca/AO13AxjtHq.json',
      title: 'Vetted Individuals',
      content: `Fill Enterprise Application talent gaps in your next project by hiring a pre-vetted EAS professional, who brings a niche skillset and industry-specific knowledge.`
    },
    {
      lottie: 'https://lottie.host/1ff30c54-0496-4946-a30c-0d0690e85c81/MDWAKwRlZi.json',
      title: 'Full Teams',
      content: `With a fully-equipped EAS Team of professionals, you get the knowledge and support you need for Enterprise Software projects. We assemble your ideal team members, facilitate their on-boarding, and ensure everyone is off to a great start`
    },
    {
      lottie: 'https://lottie.host/b9233ad0-d539-4160-86c4-747d871ccac2/JlLPj9U19M.json',
      title: 'Enterprise Application Projects',
      content: `Partner with a distributed enterprise software team to handle a variety of projects including Configuration/Customization, Development , UI/UX design, analysis, project management, quality assurance, maintenance, and support`
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

  protected readonly counters: {
    count: string;
    text: string;
  }[] = [
      {
        count: '210+',
        text: 'EAS Experts Vetted'
      },
      {
        count: '60',
        text: 'Enterprise Apps Supported'
      },
      {
        count: '72 Hrs',
        text: 'Avg. Time-to-Hire'
      },
      // {
      //   count: '95%',
      //   text: 'Client Satisfaction Rate'
      // },
    ];
}
