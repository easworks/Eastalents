import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPaperPlane, faSuitcase, faUser, IconDefinition } from '@fortawesome/free-solid-svg-icons';

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

  protected readonly metrics: {
    icon: IconDefinition,
    label: string;
    value: string | number;
  }[] = [
      {
        icon: faSuitcase,
        label: 'Scheduled Interview',
        value: mockMetrics.scheduledInterviews
      },
      {
        icon: faPaperPlane,
        label: 'Sent Applications',
        value: mockMetrics.applicationCount
      },
      {
        icon: faUser,
        label: 'Viewed by Others',
        value: mockMetrics.profileViewCount
      },
      {
        icon: faEnvelope,
        label: 'Unread Messages',
        value: mockMetrics.unreadMessages
      }
    ];


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