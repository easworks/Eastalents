import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatExpansionModule } from '@angular/material/expansion';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { HelpGroup } from '@easworks/app-shell/services/help';
import { MenuItem } from '@easworks/app-shell/state/menu';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FAQGroup, FAQListComponent } from '../common/faq-list.component';
import { COMPANY_TYPE_DATA } from '../company-type/data';
import { SERVICE_TYPE_DATA } from '../service-type/data';
import { GENERIC_ROLE_DATA } from '../generic-role/data';

@Component({
  standalone: true,
  selector: 'for-companies-page',
  templateUrl: './for-companies.page.html',
  styleUrls: ['./for-companies.page.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    MatExpansionModule,
    LottiePlayerDirective,
    FAQListComponent,
    RouterModule
  ]
})
export class ForCompaniesPageComponent {

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
    faAngleRight
  } as const;

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

  protected readonly faqs$ = signal<FAQGroup[]>([]);

  protected readonly serviceTypes = Object.entries(SERVICE_TYPE_DATA)
    .map(([key, value]) => {
      return {
        link: `/service-type/${key}`,
        name: value.herosection.title.highlight
      } as MenuItem;
    });

  protected readonly genericRoles = Object.entries(GENERIC_ROLE_DATA)
    .map(([key, value]) => {
      return {
        link: `/generic-role/${key}`,
        name: value.herosection.title.highlight
      } as MenuItem;
    });

  protected readonly companyTypes = Object.entries(COMPANY_TYPE_DATA)
    .map(([key, value]) => {
      return {
        link: `/company-type/${key}`,
        name: value.name
      } as MenuItem;
    });

}