import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';

@Component({
  standalone: true,
  selector: 'use-case-tiles-container',
  templateUrl: './use-case-tiles-container.component.html',
  imports: [
    CommonModule,
    LottiePlayerDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UseCaseTilesContainerComponent {
  @HostBinding()
  private readonly class = 'flex gap-8 flex-wrap justify-center items-stretch';

  @Input({ required: true })
  useCases: {
    lottie: string;
    title: string;
  }[] = [];
}