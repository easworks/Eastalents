import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faAngleRight, faFileLines, faMagnifyingGlass, faBullseye, faFilePen } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SERVICE_TYPE_DATA, ServiceType } from './data';

@Component({
  standalone: true,
  selector: 'service-type-page',
  templateUrl: './service-type.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    ImportsModule
  ]
})
export class ServiceTypePageComponent {

  constructor() {
    inject(ActivatedRoute).data
      .pipe(takeUntilDestroyed())
      .subscribe(d => {
        this.ServiceType$.set(d['ServiceType']);
      });
  }

  protected readonly icons = {
    faAngleRight,
    faFileLines,
    faMagnifyingGlass,
    faBullseye,
    faFilePen
  } as const;

  protected readonly ServiceType$ = signal<ServiceType>(SERVICE_TYPE_DATA['direct-hiring']);

  protected readonly stepsBreakpointClasses$ = computed(() => {
    const service = this.ServiceType$();

    const items = service.ForSteps.ContentBox.length;

    if (items === 5) {
      return {
        container: 'max-w-4xl @6xl:flex-nowrap @6xl:max-w-none',
        item: '@6xl:flex-shrink'
      };
    }
    else {
      return {
        container: 'max-w-3xl @4xl:flex-nowrap @4xl:max-w-none',
        item: '@4xl:flex-shrink'
      };
    }
  });

  protected readonly customerLogos = [
    'client-1.png',
    'client-2.png',
    'client-3.png',
    'client-4.png',
    'client-5.png',
    'client-1.png',
  ].map(v => `/assets/img/${v}`);

  protected readonly EASTalent = [
    {
      image: '/assets/img/profile2/expense121_headshot_of_male_european_young_female_techie_wearin_3cb00e3f-5c62-4169-a4b0-65581e5379c1.png',
      name: 'Heather F.',
      position: 'Growth Marketer',
      Skills: 'In Demand Skills',
      moreword: 'Strategy A/B Testing Paid Social Management Lead Generation Conversion Copywriting +3 More'
    },
    {
      image: '/assets/img/profile2/expense121_headshot_of_male_european_young_female_techie_wearin_8a4ebed7-69e5-4907-9062-43e298d05434.png',
      name: 'Benjamin L.',
      position: 'Fractional CMO',
      Skills: 'In Demand Skills',
      moreword: 'Inbound Marketing Funnel Optimization Paid Social Strategy Lead Generation Marketing Strategy +5 More'
    },
    {
      image: '/assets/img/profile2/David -Eng Manager.png',
      name: 'Mike V.',
      position: 'Full Stack Developer',
      Skills: 'In Demand Skills',
      moreword: 'Apache ANSI SQL Node.js Typescript Ruby on Rails +3 More'
    },
    {
      image: '/assets/img/profile2/expense121_headshot_of_male_european_young_office_female_techie_032690ca-4160-4179-ba79-b70d62018684.png',
      name: 'Sabina F.',
      position: 'Paid Social Expert',
      Skills: 'In Demand Skills',
      moreword: 'Analytics Social Media Strategy Facebook Ads Manager Campaign Management Inbound Lead Gen Copywriting +5 More'
    }
  ];

  protected readonly ProfessionalProfile = [
    {
      image: '/assets/img/profile2/expense121_headshot_of_male_european_young_office_female_techie_032690ca-4160-4179-ba79-b70d62018684.png',
      name: 'Gabriela Santos',
      position: 'Salesforce Developer',
      localtion: 'Rio De Janeiro, Brazil',
      experience: 'Experience: 6 Years',
      industry: 'Industry/Automotive'
    },
    {
      image: '/assets/img/profile2/expense121_headshot_of_young_male_average_looking_american_tech_d1eafc07-7016-47f7-9b84-00f3b1cbc9e3 (2).png',
      name: 'Maximilian Schmitt',
      position: 'Oracle Fusion Financial Consultant',
      localtion: 'Hohenbrunn, Germany',
      experience: 'Experience: 6 Years',
      industry: 'Industry/Manufacturing'
    },
    {
      image: '/assets/img/profile2/expense121_headshot_of_male_latina_young_techie_with_age_of_32_90e5e9fb-6c01-429c-a8a8-977e3fdf9a9d.png',
      name: 'Rohith Sharma',
      position: 'Windchill PLM developer',
      localtion: 'Banglore, India',
      experience: 'Experience: 9 Years',
      industry: 'Industry/Retail'
    },
    {
      image: '/assets/img/profile2/expense121_headshot_of_male_european_young_female_techie_wearin_8a4ebed7-69e5-4907-9062-43e298d05434.png',
      name: 'Emily Johnson',
      position: 'SAP ABAP Consultant',
      localtion: 'Corona, California, United States',
      experience: 'Experience: 15+ Years',
      industry: 'Industry/Insurance and tech'
    },
    {
      image: '/assets/img/profile2/John-CEO.png',
      name: 'David Paul',
      position: 'Full Stack Developer',
      localtion: 'Texas, United States',
      experience: 'Experience: 16+ Years',
      industry: 'Industry/Pharmaceuticals'
    },
    {
      image: '/assets/img/profile2/expense121_headshot_of_male_european_young_female_techie_wearin_d09ecb65-2c8e-477e-828b-15a4e71409b8.png',
      name: 'Ava Thompson',
      position: 'Software developer',
      localtion: 'Greater Bristol Area, United Kingdom',
      experience: 'Experience: 9+ Years',
      industry: 'Industry/Telecom'
    },
    {
      image: '/assets/img/profile2/expense121_headshot_of_young_male_latina_techie_with_age_of_32_79be1cb6-b9aa-45dd-a8ae-429368766b29.png',
      name: 'Alejando',
      position: 'Senior Software developer',
      localtion: 'Mexico City, Mexico',
      experience: 'Experience: 12+ Years',
      industry: 'Industry/Retail'
    },
    {
      image: '/assets/img/profile2/expense121_headshot_of_male_european_young_office_female_techie_993626a3-65e7-46d8-b9df-73bde927954d.png',
      name: 'Lauren Evans',
      position: 'IoT Developer',
      localtion: 'Greater Toronto Area, Canada',
      experience: 'Experience: 12+ Years',
      industry: 'Industry/Healthcare'
    }
  ];
}
