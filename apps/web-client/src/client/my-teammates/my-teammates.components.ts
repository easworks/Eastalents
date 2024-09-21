import { ChangeDetectionStrategy, Component, HostBinding, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDefinition, faBell, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CollabPopupComponent } from './collab-popup/collab-popup.component';

@Component({
  selector: 'app-my-teammates',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule, CollabPopupComponent],
  templateUrl: './my-teammates.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyTeammatesComponent {
  @HostBinding() private readonly class = "page";
  bellIcon:IconDefinition = faBell
  trashIcon:IconDefinition = faTrash
  editIcon:IconDefinition = faEdit

  protected readonly isEditPopupVisible$ = signal(false);

  protected readonly items = Array(5).fill(0);
}
