import { Component } from '@angular/core';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';
import { CommonModule } from '@angular/common';
import { AllJobsComponent } from './all-jobs/all-jobs.component';
import { AppliedJobsComponent } from './applied-jobs/applied-jobs.component';

@Component({
  selector: 'app-mock-jobs',
  standalone: true,
  imports: [JobPostCardComponent,CommonModule, AllJobsComponent, AppliedJobsComponent],
  templateUrl: './mock-jobs.component.html',
  styleUrl: './mock-jobs.component.css'
})
export class MockJobsComponent {
  activeTab: string = 'all-jobs';
  protected readonly items = Array(2).fill(0);
  
  openFilter: boolean = false;

  setOpenFilter(){
    this.openFilter = !this.openFilter;
  }

  

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }

}
