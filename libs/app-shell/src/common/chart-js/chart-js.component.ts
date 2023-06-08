import { ChangeDetectionStrategy, Component, ElementRef, Input, inject } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'chart-js',
  templateUrl: './chart-js.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartJsComponent {
  constructor() {
    console.debug(this.config, this.element);
  }
  private readonly element = inject(ElementRef).nativeElement;
  @Input({ required: true }) config!: ChartConfiguration;
}