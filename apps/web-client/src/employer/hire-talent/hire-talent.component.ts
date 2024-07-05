import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';
import { IconDefinition, faAdd, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-spoc',
  standalone: true,
  imports: [CommonModule,JobPostCardComponent, FontAwesomeModule],
  templateUrl: './hire-talent.component.html',
})
export class HireTalentComponent {
  addIcon:IconDefinition = faAdd
  bellIcon:IconDefinition = faBell
  protected readonly items = Array(5).fill(0);
}
