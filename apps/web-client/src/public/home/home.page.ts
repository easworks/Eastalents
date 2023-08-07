import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    LottiePlayerDirective
  ]
})
export class HomePageComponent {
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
}
