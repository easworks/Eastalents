import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'use-case-tiles-container',
  templateUrl: './use-case-tiles-container.component.html',
  imports: [
    CommonModule,
    LottiePlayerDirective
  ]
})
export class UseCaseTilesContainerComponent {
  @HostBinding()
  private readonly class = 'block';

  @Input({ required: true })
  useCases: {
    lottie: string;
    title: string;
  }[] = [];
}