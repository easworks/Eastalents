import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { facCertificateCheck, facCornerRibbon } from 'custom-icons';
import { achievements } from '../common/achievements';
import { ScrollToTopComponent } from '../common/scroll-to-top/scroll-to-top.component';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrl: './home.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ImportsModule,
    ScrollToTopComponent
  ]
})
export class HomePageComponent {
  protected readonly icons = {
    faLocationDot,
    facCertificateCheck,
    facCornerRibbon
  } as const;

  protected readonly achievements = achievements;

  protected readonly madeEasySection = {
    devs: [
      {
        name: 'Arizona Cardinals',
        role: 'Full-stack Developer',
        image: '/assets/public/home/enterprise-app-dev/dev1.png',
        location: 'Puna, India',
        badge: 'bg-emerald-400',
        highlight: false
      },
      {
        name: 'Green Bay Packers',
        role: 'Full-stack Developer',
        image: '/assets/public/home/enterprise-app-dev/dev2.png',
        location: 'Puna, India',
        badge: 'bg-primary-400',
        highlight: true
      },
      {
        name: 'Baltimore Ravens',
        role: 'Full-stack Developer',
        image: '/assets/public/home/enterprise-app-dev/dev3.png',
        location: 'Puna, India',
        badge: 'bg-yellow-400',
        highlight: false
      }
    ]
  } as const;


}