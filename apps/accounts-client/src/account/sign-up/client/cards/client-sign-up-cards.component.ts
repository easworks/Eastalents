import { Component } from '@angular/core';
import { NgSwiperModule } from '@easworks/app-shell/common/swiper/swiper.module';
import { SwiperOptions } from 'swiper/types';

@Component({
  standalone: true,
  templateUrl: './client-sign-up-cards.component.html',
  styleUrl: './client-sign-up-cards.component.less',
  selector: 'client-sign-up-cards',
  imports: [
    NgSwiperModule
  ]
})
export class ClientSignUpCardsComponent {
  protected readonly swiperOptions: SwiperOptions = {
    autoplay: true,
    loop: true
  };
}