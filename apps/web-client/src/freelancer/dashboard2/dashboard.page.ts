import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEnvelope, faPaperPlane, faSuitcase, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'new-dashboard-page',
  templateUrl: './dashboard.page.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FontAwesomeModule
  ]
})
export class DashboardComponent {
  protected readonly icons = {
    faSuitcase, faPaperPlane, faUser, faEnvelope
  } as const;
}