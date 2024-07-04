import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostCardComponent } from '../../job-post-card/job-post-card.component';

@Component({
  selector: 'app-all-jobs',
  standalone: true,
  imports: [CommonModule, JobPostCardComponent],
  templateUrl: './all-jobs.component.html',
  styleUrl: './all-jobs.component.less',
})
export class AllJobsComponent {
  protected readonly items = Array(2).fill(0);
}
