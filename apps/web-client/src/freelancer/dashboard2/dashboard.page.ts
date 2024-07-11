import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPaperPlane, faSuitcase, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  standalone: true,
  selector: 'new-dashboard-page',
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.less',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class DashboardComponent {

  @HostBinding()
  private readonly class = 'page @container';

  protected readonly icons = {
    faSuitcase, faPaperPlane, faUser, faEnvelope
  } as const;

  protected readonly metrics = mockMetrics;


}

interface ProfileMetrics {
  scheduledInterviews: number;
  applicationCount: number;
  profileViewCount: number;
  unreadMessages: number;
}

const mockMetrics: ProfileMetrics = {
  scheduledInterviews: 76,
  applicationCount: 65,
  profileViewCount: 35673,
  unreadMessages: 83
};