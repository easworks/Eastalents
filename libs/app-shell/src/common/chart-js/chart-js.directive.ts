import { Directive, ElementRef, Input, OnChanges, inject } from '@angular/core';
import { Chart, ChartConfiguration } from 'chart.js';

@Directive({
  selector: 'canvas [chart-js]',
  standalone: true,
})
export class ChartJsDirective implements OnChanges {
  private readonly element = inject(ElementRef).nativeElement;
  @Input({ required: true }) config!: ChartConfiguration;
  private chart?: Chart;

  async ngOnChanges() {
    switch (this.config.type) {
      case 'pie':
        await import('./pie');
        break;
      default: throw new Error('not implemented');
    }

    this.chart?.destroy();
    this.chart = new Chart(this.element, this.config);
  }
}