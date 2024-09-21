import { Component, HostBinding, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobPostCardComponent } from '../job-post-card/job-post-card.component';
import { IconDefinition, faAdd, faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-spoc',
  standalone: true,
  imports: [CommonModule,JobPostCardComponent, FontAwesomeModule],
  templateUrl: './hire-talent.component.html',
  styleUrl: './hire-talent.component.less',
})
export class HireTalentComponent {
  @HostBinding() private readonly class = "page";
  protected readonly activeTab$ = signal<Tab>('all-jobs');
  protected readonly isEditPopupVisible$ = signal(false)

  protected readonly icons = {
    faAdd,faBell
  } as const;
  protected readonly items = Array(5).fill(0);
  protected readonly hiringItems = Array(5).fill(0);
}

type Tab = 'all-jobs'|'hiring'
