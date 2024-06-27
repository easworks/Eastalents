import { Component } from '@angular/core';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mock-saved-job',
  standalone: true,
  imports: [JobPostCardComponent,CommonModule],
  templateUrl: './mock-saved-job.component.html',
  styleUrl: './mock-saved-job.component.css'
})
export class MockSavedJobComponent {
  protected readonly items = Array(12).fill(0);
}
