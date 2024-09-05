import { Component } from '@angular/core';
import { NgSwiperModule } from 'app-shell/common/swiper/swiper.module';
import { SwiperOptions } from 'swiper/types';

@Component({
  standalone: true,
  templateUrl: './talent-sign-up-cards.component.html',
  styleUrl: './talent-sign-up-cards.component.less',
  selector: 'talent-sign-up-cards',
  imports: [
    NgSwiperModule,
  ]
})
export class TalentSignUpCardsComponent {
  protected readonly swiperOptions: SwiperOptions = {
    autoplay: true,
    loop: true
  };
}