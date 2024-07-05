import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-job-post-card',
  templateUrl: './job-post-card.component.html',
  styleUrl: './job-post-card.component.less',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class JobPostCardComponent {
}
