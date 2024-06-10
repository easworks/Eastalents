import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LottiePlayerDirective } from '@easworks/app-shell/common/lottie-player.directive';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
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
  ]
})
export class EmployerDashboardComponent { 
  protected readonly icons = {
    faCheck
  } as const;

  protected readonly accelerate = [
    {
      lottie: '/assets/img/Search.svg',
      title: '45408',
      content: `All Talenets`
    },
    {
      lottie: '/assets/img/job.svg',
      title: '1',
      content: `Job Poster`
    },
    {
      lottie: '/assets/img/computer.svg',
      title: '1',
      content: `Vacancies`
    },
    {
      lottie: '/assets/img/hire.svg',
      title: '0',
      content: `Hired`
    },
  ];
}