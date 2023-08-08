import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
  selector: 'lottie-player',
  standalone: true,
})
export class LottiePlayerDirective {
  @HostBinding()
  @Input() src?: string;
}
