import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IconDefinition, faBell, faCircleInfo, faI, faIcicles } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cost-calculator',
  standalone: true,
  imports: [CommonModule,JobPostCardComponent, FontAwesomeModule],
  templateUrl: './cost-calculator.component.html',
})
export class CostCalculatorComponent {
  bellIcon: IconDefinition = faBell
  iIcon: IconDefinition = faCircleInfo

}
