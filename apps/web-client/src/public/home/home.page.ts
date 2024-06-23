import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { DomainsApi } from '@easworks/app-shell/api/domains.api';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { NgSwiperModule, SwiperModuleId } from '@easworks/app-shell/common/swiper.module';
import { TW_THEME } from '@easworks/app-shell/common/tw-theme';
import { DomainState } from '@easworks/app-shell/state/domains';
import { UI_FEATURE } from '@easworks/app-shell/state/ui';
import { sortString } from '@easworks/app-shell/utilities/sort';
import { fromPromise } from '@easworks/app-shell/utilities/to-promise';
import { DomainModule } from '@easworks/models';
import { IconDefinition, faAngleLeft, faAngleRight, faBolt, faCar, faCartShopping, faMinus, faMoneyBill, faPlane, faPlus, faShirt, faStar, faStethoscope, faStore, faUsers } from '@fortawesome/free-solid-svg-icons';
import { Store } from '@ngrx/store';
import { SwiperOptions } from 'swiper/types';
import { DomainSoftwareSelectorComponent } from '../common/domain-software-selector.component';
import { FeaturedDomainsComponent } from '../common/featured-domains.component';
import { UseCaseTilesContainerComponent } from '../common/use-case-tiles-container.component';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrl: './home.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    FeaturedDomainsComponent,
    UseCaseTilesContainerComponent,
    DomainSoftwareSelectorComponent,
    MatSelectModule,
    FormsModule,
    RouterModule,
    NgSwiperModule
  ]
})
export class HomePageComponent {
  private readonly domainState = inject(DomainState);
  private readonly twTheme = inject(TW_THEME) as any;
  private readonly api = {
    domains: inject(DomainsApi)
  } as const;
  private readonly store = inject(Store);
  private readonly screenSize$ = this.store.selectSignal(UI_FEATURE.selectScreenSize);

  protected readonly icons = {
    faAngleRight,
    faAngleLeft,
    faMinus,
    faPlus
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
      image: '/assets/public/home/how-eas-works/share-enterprise-challenge.jpg',
      title: 'Share Your Enterprise Application Challenge',
      content: `Describe your project requirements and desired outcomes. 
        We'll analyze your needs and prepare a detailed talent profile, 
        considering tech stack, experience, and industry-specific challenges.`
    },
    {
      image: '/assets/public/home/how-eas-works/choose-eas-expert.jpg',
      title: 'Choose from Our EAS Expert Recommendations',
      content: `Receive tailored recommendations of top professionals who match 
        your talent profile. Handpick the candidate who perfectly fits your 
        needs, ensuring a seamless integration into your team.`
    },
    {
      image: '/assets/public/home/how-eas-works/deploy-and-enhance-application.jpg',
      title: 'Deploy & Enhance Your Application',
      content: `After selecting your ideal candidate, we handle all contractual details. 
        Focus on starting and enhancing your enterprise application with our skilled 
        professionals.`
    }
  ];

  protected readonly accelerate = [
    {
      lottie: 'https://lottie.host/d1c2490c-af63-4ea7-a623-0b51dd9764ca/AO13AxjtHq.json',
      title: 'Hire Contractors',
      content: `Fill Enterprise Application Software (EAS) talent gaps with 
        pre-vetted professionals for specialized Enterprise App skills with 
        Industry domain expertise.`
    },
    {
      lottie: 'https://lottie.host/1ff30c54-0496-4946-a30c-0d0690e85c81/MDWAKwRlZi.json',
      title: 'Hire Full-Time',
      content: `Secure top talent with specialized Enterprise Application 
        Software (EAS) skills and industry expertise. Our pre-vetted 
        professionals ensure long-term success and seamless team integration.`
    },
    {
      lottie: 'https://lottie.host/b9233ad0-d539-4160-86c4-747d871ccac2/JlLPj9U19M.json',
      title: 'Hire Fully Managed Team',
      content: `Get a fully equipped EAS team with the expertise and support
        for your enterprise software projects. We assemble your ideal team,
        handle onboarding, and ensure a smooth start.`
    },
    {
      lottie: 'https://lottie.host/b9233ad0-d539-4160-86c4-747d871ccac2/JlLPj9U19M.json',
      title: 'Managed end-to-end Solution',
      content: `Partner with EASWORKS to manage & execute your enterprise application 
        projects, covering a spectrum of services including Consulting, Software 
        Development, Integration Services, Customization and Configuration, Migration 
        Services, and Support and Maintenance.`
    }
  ];



  protected readonly roleList = this.initRoleList();

  private initRoleList() {
    const domains$ = this.domainState.domains.map$;
    const featured$ = fromPromise(
      this.api.domains.featuredDomains()
        .then(domains => domains.map(d => d.domain)),
      []);


    const list$ = computed(() => {
      const featured = featured$();
      const domains = domains$();

      if (featured.length === 0 || domains.size === 0)
        return [];

      return featured
        .map(f => {
          const domain = domains.get(f);
          if (!domain)
            throw new Error(`could not find domain ${f}`);
          return domain;
        })
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

          const showMore$ = signal(false);
          const toggleMore = () => showMore$.update(v => !v);

          return {
            name: domain.longName,
            key: domain.key,
            modules,
            selectedModule$,
            roles$,
            showMore$,
            toggleMore
          };
        });
    });

    const items$ = computed(() => {
      const ss = this.screenSize$();

      switch (ss) {
        case 'xs':
        case 'sm':
        case 'md':
        case 'lg':
        case 'xl': return 7;
        case '2xl':
        case '3xl': return 14;
        case '4xl':
        case '5xl': return 21;
        case '6xl':
        case '7xl': return 28;
        case '8xl':
        case '9xl':
        case '10xl': return 35;
      }
    });

    const loading$ = computed(() => list$().length === 0);

    return { list$, loading$, items$ };
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

  protected readonly industries = (() => {
    const slides: {
      icon: IconDefinition;
      text: string;
    }[] = [
        {
          icon: faStar,
          text: 'Popular'
        },
        {
          icon: faCartShopping,
          text: 'E-Commerce'
        },
        {
          icon: faStethoscope,
          text: 'Healthcare'
        },
        {
          icon: faCar,
          text: 'Automobile'
        },
        {
          icon: faPlane,
          text: 'Aerospace'
        },
        {
          icon: faMoneyBill,
          text: 'Banking'
        },
        {
          icon: faUsers,
          text: 'Consulting'
        },
        {
          icon: faStore,
          text: 'Retail'
        },
        {
          icon: faShirt,
          text: 'Finance'
        },
        {
          icon: faBolt,
          text: 'Energy'
        },
      ];

    const swiper = {
      modules: ['navigation'] satisfies SwiperModuleId[],
      options: {
        slidesPerView: 6,
        loop: true,
      } satisfies SwiperOptions
    } as const;

    return {
      slides,
      swiper
    } as const;
  })();

}