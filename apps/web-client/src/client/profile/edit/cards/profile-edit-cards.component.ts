import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'client-profile-edit-cards',
  templateUrl: './profile-edit-cards.component.html',
  styleUrl: './profile-edit-cards.component.less',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientProfileEditCardsComponent {


}