import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'job-post-card',
  templateUrl: './job-post-card.component.html',
  styleUrl: './job-post-card.component.less',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPostCardComponent {
  public readonly item$ = input(null as unknown, { alias: 'item' });
}
