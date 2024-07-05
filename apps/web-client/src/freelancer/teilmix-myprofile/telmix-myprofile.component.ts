import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TelmixProfileOverviewComponent } from './telmix-profile-overview/telmix-profile-overview.component';
import { TelmixProfileExperienceComponent } from './telmix-profile-experience/telmix-profile-experience.component';
import { TelmixProfileEducationComponent } from './telmix-profile-education/telmix-profile-education.component';

@Component({
  selector: 'app-telmix-myprofile',
  standalone: true,
  imports: [CommonModule, TelmixProfileExperienceComponent, TelmixProfileEducationComponent, TelmixProfileOverviewComponent ],
  templateUrl: './telmix-myprofile.component.html',
  styleUrl: './telmix-myprofile.component.css'
})
export class TelmixMyprofileComponent {
  activeTab: string = 'overview';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }
}
