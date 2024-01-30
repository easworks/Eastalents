import { Directive, ElementRef, HostBinding, Input, OnChanges, SimpleChanges, inject } from '@angular/core';

@Directive({
  selector: 'lottie-player',
  standalone: true
})
export class LottiePlayerDirective implements OnChanges {

  private readonly el = inject(ElementRef).nativeElement;

  @HostBinding()
  @Input() src?: string;

  ngOnChanges(changes: SimpleChanges): void {
    const src = changes['src'];
    if (src.firstChange || src.currentValue === src.previousValue) {
      return;
    }
    else {
      this.el.load(src.currentValue);
    }
  }
}
