import { Component, EventEmitter, Output } from '@angular/core';


@Component({
  selector: 'app-experience-skill-layout',
  standalone: true,
  imports: [],
  templateUrl: './experience-skill-layout.component.html',
  styleUrl: './experience-skill-layout.component.css'
})
export class ExperienceSkillLayoutComponent {
  @Output() openSkillPopup = new EventEmitter<void>();

  // Method to open the skill popup
  showSkillPopup() {
    this.openSkillPopup.emit();
  }
}
