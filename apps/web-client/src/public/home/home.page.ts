import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { facCertificateCheck, facCornerRibbon } from 'custom-icons';

@Component({
  standalone: true,
  selector: 'home-page',
  templateUrl: './home.page.html',
  styleUrl: './home.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FontAwesomeModule
  ]
})
export class HomePageComponent {
  protected readonly icons = {
    faLocationDot,
    facCertificateCheck,
    facCornerRibbon
  } as const;

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