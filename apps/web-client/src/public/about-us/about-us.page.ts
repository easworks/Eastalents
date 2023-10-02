import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { ImportsModule } from '@easworks/app-shell/common/imports.module';

@Component({
  standalone: true,
  selector: 'about-us-page',
  templateUrl: './about-us.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [],
  imports: [
    LottiePlayerDirective,
    ImportsModule,
  ]
})
export class AboutUsPageComponent {

  protected readonly industries = [
    {
      title: 'Automotive'
    },
    {
      title: 'Banking and financial services'
    },
    {
      title: 'Healthcare'
    },
    {
      title: 'Manufacturing'
    },
    {
      title: 'Retail'
    },
    {
      title: 'Insurance and tech'
    },
    {
      title: 'Electronics and High Tech'
    },
    {
      title: 'Consumer Packaged Goods'
    },
  ];


  protected readonly coreValues = [
    {
      title: 'GROW TOGETHER',
      img: '/assets/img/icon-value-grow.svg',
      content: 'We empower people and enterprises to reach their full potential.',
    },
    {
      title: 'CREATE CLIENT VALUE',
      img: '/assets/img/icon-value-value.svg',
      content: 'We thrive to exceed client expectations. Always.',
    },
    {
      title: 'FOCUS ON YOUR SUCCESS',
      img: '/assets/img/target-line-icon.svg',
      content: 'Our business strategy is simple: if our customers business is booming, we are growing too',
    },
    {
      title: 'INNOVATE',
      img: '/assets/img/icon-value-innovate.svg',
      content: 'We don’t wait for change. We create it.',
    },
    {
      title: 'DELIVER EXCELLENCE',
      img: '/assets/img/icon-value-excellence.svg',
      content: 'Were accountable to ourselves and to every enterprise and colleague.',
    }

  ];
}
