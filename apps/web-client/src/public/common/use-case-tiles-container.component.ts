import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'use-case-tiles-container',
  templateUrl: './use-case-tiles-container.component.html',
  imports: [
    CommonModule,
    LottiePlayerDirective,
    RouterModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseCaseTilesContainerComponent {
  @HostBinding()
  private readonly class = 'flex gap-8 flex-wrap justify-center items-stretch';

  protected readonly useCases = [
    {
      lottie: 'https://lottie.host/4c9690fd-2f7c-4f2d-8d17-189cd10faa13/ZVqeAIMqEv.json',
      title: 'Digital Transformation (DX)',
      link: '/use-cases/digital-transformation'
    },
    {
      lottie: 'https://lottie.host/24cc3e35-b8db-4ea0-a1ba-b32a2f697da6/AgufANxAwn.json',
      title: 'Innovation',
      link: '/use-cases/innovation'
    },
    {
      lottie: 'https://lottie.host/da0ab755-9ffb-44dd-acf1-af038e744642/AbXDubIFQZ.json',
      title: 'Prototyping',
      link: '/use-cases/prototyping'
    },
    {
      lottie: 'https://lottie.host/6cd7a0ca-c8e5-4f78-bdcd-25f0d6d8066b/88foE2hAa4.json',
      title: 'Enterprise Application Design',
      link: '/use-cases/enterprise-application-design'
    },
    {
      lottie: 'https://lottie.host/fbafaf32-a5a8-4a76-ab00-6b0b882e187f/FrPuBm1o9l.json',
      title: 'Business Intelligence',
      link: '/use-cases/business-intelligence'
    },

    {
      lottie: 'https://lottie.host/b49f7ed3-7477-4e11-b459-ba4e84f73f41/Pl7fmKo631.json',
      title: 'Application Modernization',
      link: '/use-cases/application-modernization'
    },
    {
      lottie: 'https://lottie.host/61f54bac-ee62-484d-8908-2aa4644c600b/Cf0ihIA945.json',
      title: 'Custom Enterprise Application',
      link: '/use-cases/custom-enterprise-application'
    },
    {
      lottie: 'https://lottie.host/c0792fd1-027a-4eeb-801b-52b35b8e9624/VorTfvoJLp.json',
      title: 'Enterprise Application Integration',
      link: '/use-cases/enterprise-application-integration'
    },
    {
      lottie: 'https://lottie.host/74dd853e-638d-4dbf-9120-4420cfae8331/lO1RikmPXS.json',
      title: 'Data Migration',
      link: '/use-cases/data-migration'
    },
    {
      lottie: 'https://lottie.host/0eac63f0-c4f9-4871-978c-a0022af48c10/E0JHkNudaq.json',
      title: 'Support & Maintenance',
      link: '/use-cases/support-and-maintenance'
    },
  ];
}