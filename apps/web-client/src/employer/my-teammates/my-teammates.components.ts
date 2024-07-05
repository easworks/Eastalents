import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconDefinition, faBell, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-my-teammates',
  standalone: true,
  imports: [CommonModule,FontAwesomeModule],
  templateUrl: './my-teammates.component.html',
})
export class MyTeammatesComponent {
  bellIcon:IconDefinition = faBell
  trashIcon:IconDefinition = faTrash
  editIcon:IconDefinition = faEdit
  protected readonly items = Array(5).fill(0);
}
