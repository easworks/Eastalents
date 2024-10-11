import { ChangeDetectionStrategy, Component, input, signal } from "@angular/core";
import { ImportsModule } from "@easworks/app-shell/common/imports.module";
import { Domain } from "@easworks/models/domain";
import { achievements } from "../common/achievements";

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'domains-page',
  templateUrl: './domains.page.html',
  styleUrl: './domains.page.less',
  imports: [ImportsModule]
})

export class DomainsPageComponent {

  protected readonly domain$ = input.required<Domain>({ alias: 'domain' });
  protected readonly achievements = achievements;

  protected readonly whyEasworks$ = signal<WhyEasworksCardData[]>(demoWhyEasworks);


}

type WhyEasworksCardData = {
  icon: string;
  title: string;
  content: string;
};

const demoWhyEasworks: WhyEasworksCardData[] = [
  {
    icon: '/assets/public/domains/why-easworks/erp1.svg',
    title: 'Access to Vetted ERP Solution Architect',
    content: 'Easworks is a dedicated platform for Enterprise Applications, offering access to a carefully selected pool of thoroughly vetted ERP Solution Architect across diverse enterprise application domains, ensuring prompt and efficient talent acquisition.'
  },
  {
    icon: '/assets/public/domains/why-easworks/erp2.svg',
    title: 'Efficient Hiring Process',
    content: 'Benefit from Easworks\' ERP Solution Architect streamlined hiring process, which includes automated discovery, evaluation, and matching capabilities. This saves significant time and effort compared to traditional recruitment methods.'
  },
  {
    icon: '/assets/public/domains/why-easworks/erp3.svg',
    title: 'Flexible Hiring Options',
    content: 'Hire ERP Solution Architect with flexible options to scale your team based on your enterprise application project needs, whether for full-time positions or contract work.'
  }
];