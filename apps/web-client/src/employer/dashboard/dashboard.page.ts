import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { faCheck, faAngleRight, faSearch, faFileLines, faVolleyballBall, faSchoolCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';
@Component({
  selector: 'employer-dashboard-page',
  templateUrl: './dashboard.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterModule,
    LottiePlayerDirective,
    CommonModule,
    FontAwesomeModule
, JobPostCardComponent  ]
})
export class EmployerDashboardComponent { 
  protected readonly icons = {
    faCheck, faAngleRight, faSearch,faFileLines, faVolleyballBall, faSchoolCircleExclamation
  } as const;

  protected readonly items = Array(12).fill(0);

  protected readonly accelerate = [
    {
      lottie: faSearch,
      title: '45408',
      content: `All Talenets`
    },
    {
      lottie: faFileLines,
      title: '1',
      content: `Job Poster`
    },
    {
      lottie: faVolleyballBall,
      title: '1',
      content: `Vacancies`
    },
    {
      lottie: faSchoolCircleExclamation,
      title: '0',
      content: `Hired`
    },
  ];

  
}