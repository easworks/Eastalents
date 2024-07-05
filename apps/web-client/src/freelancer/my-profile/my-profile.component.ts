import { Component, HostBinding } from '@angular/core';
import { ExperienceSkillLayoutComponent } from '../experience-skill-layout/experience-skill-layout.component';
import { JobReferenceLayoutComponent } from '../job-reference-layout/job-reference-layout.component';
import { EducationCertificateLayoutComponent } from '../education-certificate-layout/education-certificate-layout.component';
import { CommonModule } from '@angular/common';
import { UpdateCoreSkillPopupComponent } from './update-core-skill-popup/update-core-skill-popup.component';
import { EducationPopupComponent } from './education-popup/education-popup.component';
import { CertificationPopupComponent } from './certification-popup/certification-popup.component';
import { LeftDrawerComponent } from './left-drawer/left-drawer.component';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [ExperienceSkillLayoutComponent,EducationPopupComponent, CertificationPopupComponent, JobReferenceLayoutComponent, UpdateCoreSkillPopupComponent, EducationCertificateLayoutComponent, CommonModule, LeftDrawerComponent],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent {
  @HostBinding() private readonly class = "page"
  activeTab: string = 'experience';
  popupContent: string = '';
  isSkillPopupVisible: boolean = false;
  isEducationPopupVisible: boolean = false;
  isCertificationPopupVisible: boolean = false;
  showLeftDrawer: boolean = true;

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  isActive(tab: string) {
    return this.activeTab === tab;
  }
  toggleSkillPopup() {
    this.isSkillPopupVisible = !this.isSkillPopupVisible;
  }
  toggleEducationPopup() {
    this.isEducationPopupVisible = !this.isEducationPopupVisible;
  }
  toggleCertificationPopup() {
    this.isCertificationPopupVisible = !this.isCertificationPopupVisible;
  }

  setShowLeftDrawer() {
    this.showLeftDrawer = !this.showLeftDrawer;
  }
  
}
