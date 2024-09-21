import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell, faCircleInfo } from '@fortawesome/free-solid-svg-icons';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';

@Component({
  standalone: true,
  selector: 'app-cost-calculator',
  imports: [CommonModule, JobPostCardComponent, FontAwesomeModule],
  templateUrl: './cost-calculator.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CostCalculatorComponent {

  protected readonly icons = {
    faBell,
    faCircleInfo
  } as const;
}
