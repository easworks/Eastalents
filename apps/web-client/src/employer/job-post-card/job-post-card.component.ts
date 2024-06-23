import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-job-post-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './job-post-card.component.html',
  styleUrl: './job-post-card.component.less',
})
export class JobPostCardComponent {
  @Input() item: any;
}
