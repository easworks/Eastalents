import { Component } from '@angular/core';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mock-jobs',
  standalone: true,
  imports: [JobPostCardComponent,CommonModule],
  templateUrl: './mock-jobs.component.html',
  styleUrl: './mock-jobs.component.css'
})
export class MockJobsComponent {
  protected readonly items = Array(2).fill(0);
  openFilter: boolean = false;

  setOpenFilter(){
    this.openFilter = !this.openFilter;
  }
}
