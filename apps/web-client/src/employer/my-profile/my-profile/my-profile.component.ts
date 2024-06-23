import { Component } from '@angular/core';
import { ExperienceSkillLayoutComponent } from '../../experience-skill-layout/experience-skill-layout.component';
import { JobReferenceLayoutComponent } from '../../job-reference-layout/job-reference-layout.component';
import { EducationCertificateLayoutComponent } from '../../education-certificate-layout/education-certificate-layout.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ExperienceSkillLayoutComponent, JobReferenceLayoutComponent, EducationCertificateLayoutComponent, CommonModule],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  activeTab: string = 'education';

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }
}
