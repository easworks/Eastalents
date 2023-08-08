import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { DomainState } from '@easworks/app-shell/state/domains';
import { SoftwareTilesContainerComponent } from '../common/software-tiles-container.component';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective,
    SoftwareTilesContainerComponent
  ]
})
export class HomePageComponent {
  private readonly domainState = inject(DomainState);

  // TODO: figure how to get actual featured domains
  protected readonly featuredDomains$ = computed(() => this.domainState.domains.list$().slice(0, 5));

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

  protected readonly useCases = [
    {
      lottie: 'https://lottie.host/4c9690fd-2f7c-4f2d-8d17-189cd10faa13/ZVqeAIMqEv.json',
      title: 'Digital Transformation (DX)'
    },
    {
      lottie: 'https://lottie.host/24cc3e35-b8db-4ea0-a1ba-b32a2f697da6/AgufANxAwn.json',
      title: 'Innovation'
    },
    {
      lottie: 'https://lottie.host/da0ab755-9ffb-44dd-acf1-af038e744642/AbXDubIFQZ.json',
      title: 'Prototyping'
    },
    {
      lottie: 'https://lottie.host/6cd7a0ca-c8e5-4f78-bdcd-25f0d6d8066b/88foE2hAa4.json',
      title: 'Enterprise Application Design'
    },
    {
      lottie: 'https://lottie.host/fbafaf32-a5a8-4a76-ab00-6b0b882e187f/FrPuBm1o9l.json',
      title: 'Business Intelligence'
    },

    {
      lottie: 'https://lottie.host/b49f7ed3-7477-4e11-b459-ba4e84f73f41/Pl7fmKo631.json',
      title: 'Application Modernization'
    },
    {
      lottie: 'https://lottie.host/61f54bac-ee62-484d-8908-2aa4644c600b/Cf0ihIA945.json',
      title: 'Custom Enterprise Application'
    },
    {
      lottie: 'https://lottie.host/c0792fd1-027a-4eeb-801b-52b35b8e9624/VorTfvoJLp.json',
      title: 'Enterprise Application Integration'
    },
    {
      lottie: 'https://lottie.host/74dd853e-638d-4dbf-9120-4420cfae8331/lO1RikmPXS.json',
      title: 'Data Migration'
    },
    {
      lottie: 'https://lottie.host/0eac63f0-c4f9-4871-978c-a0022af48c10/E0JHkNudaq.json',
      title: 'Support & Maintenance'
    },
  ];
}
