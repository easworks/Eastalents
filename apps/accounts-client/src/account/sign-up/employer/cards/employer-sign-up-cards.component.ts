import { Component } from '@angular/core';
import { NgSwiperModule } from '@easworks/app-shell/common/swiper/swiper.module';
import { SwiperOptions } from 'swiper/types';

@Component({
  standalone: true,
  templateUrl: './employer-sign-up-cards.component.html',
  styleUrl: './employer-sign-up-cards.component.less',
  selector: 'employer-sign-up-cards',
  imports: [
    NgSwiperModule
  ]
})
export class EmployerSignUpCardsComponent {
  protected readonly swiperOptions: SwiperOptions = {
    autoplay: true,
    loop: true
  };
}