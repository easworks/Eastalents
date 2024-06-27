import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';
import { FilterComponent } from './filter-sidepanel/filter-sidepanel.component';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule,JobPostCardComponent,FilterComponent],
  templateUrl: './my-applications.component.html',
  styleUrl: './my-applications.component.css'
})
export class MyApplicationsComponent {

  protected readonly myApplications = Array(2).fill(0);
  protected readonly myInterviews = Array(2).fill(0);

  activeTab: string = 'myapplications';
  showFiter: boolean = false

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }

  toggleFilter() {
    this.showFiter = !this.showFiter
  }

  
}
